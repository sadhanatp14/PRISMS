import { UserActivity, ActivityMetrics } from './types';

class ActivityTracker {
  private activities: UserActivity[] = [];
  private clickCount: number = 0;
  private scrollCount: number = 0;
  private keyPressCount: number = 0;
  private mouseMoveCount: number = 0;
  private pageStartTime: number = Date.now();
  private lastActivityTime: number = Date.now();
  private isActive: boolean = true;
  private scrollThrottle: boolean = false;
  private mouseMoveThrottle: boolean = false;

  constructor() {
    this.setupListeners();
  }

  private setupListeners() {
    document.addEventListener('click', (e) => this.trackClick(e));
    document.addEventListener('scroll', () => this.trackScroll());
    document.addEventListener('keydown', (e) => this.trackKeyPress(e));
    document.addEventListener('mousemove', () => this.trackMouseMove());
    window.addEventListener('focus', () => this.trackPageFocus(true));
    window.addEventListener('blur', () => this.trackPageFocus(false));
  }

  private trackClick(event: MouseEvent) {
    this.clickCount++;
    this.lastActivityTime = Date.now();
    
    const target = event.target as HTMLElement;
    const activity: UserActivity = {
      type: 'click',
      timestamp: new Date().toISOString(),
      details: {
        elementType: target.tagName,
        elementClass: target.className,
        x: event.clientX,
        y: event.clientY
      }
    };
    this.activities.push(activity);
  }

  private trackScroll() {
    if (this.scrollThrottle) return;
    this.scrollThrottle = true;
    setTimeout(() => { this.scrollThrottle = false; }, 500);

    this.scrollCount++;
    this.lastActivityTime = Date.now();
    
    const activity: UserActivity = {
      type: 'scroll',
      timestamp: new Date().toISOString(),
      details: {
        scrollY: window.scrollY,
        scrollX: window.scrollX
      }
    };
    this.activities.push(activity);
  }

  private trackKeyPress(event: KeyboardEvent) {
    // Don't track passwords or sensitive fields
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
      return;
    }

    this.keyPressCount++;
    this.lastActivityTime = Date.now();
    
    const activity: UserActivity = {
      type: 'keypress',
      timestamp: new Date().toISOString(),
      details: {
        key: event.key,
        code: event.code
      }
    };
    this.activities.push(activity);
  }

  private trackMouseMove() {
    if (this.mouseMoveThrottle) return;
    this.mouseMoveThrottle = true;
    setTimeout(() => { this.mouseMoveThrottle = false; }, 1000);

    this.mouseMoveCount++;
    this.lastActivityTime = Date.now();
  }

  private trackPageFocus(hasFocus: boolean) {
    this.isActive = hasFocus;
    const activity: UserActivity = {
      type: 'page_focus',
      timestamp: new Date().toISOString(),
      details: { focused: hasFocus }
    };
    this.activities.push(activity);
  }

  public getMetrics(): ActivityMetrics {
    const timeOnPage = Math.floor((Date.now() - this.pageStartTime) / 1000);
    
    // Calculate risk based on activity patterns
    let activityRiskScore = 0;
    
    // Rapid clicking can indicate haste (risky behavior)
    if (this.clickCount > 30) activityRiskScore += 10;
    else if (this.clickCount > 20) activityRiskScore += 5;
    
    // Lots of keyboard activity (typing passwords frequently)
    if (this.keyPressCount > 100) activityRiskScore += 8;
    else if (this.keyPressCount > 50) activityRiskScore += 4;
    
    // Inactivity then sudden activity (suspicious pattern)
    const timeSinceLastActivity = Math.floor((Date.now() - this.lastActivityTime) / 1000);
    if (timeSinceLastActivity > 300 && this.clickCount > 0) activityRiskScore += 3;

    return {
      totalClicks: this.clickCount,
      totalScrollEvents: this.scrollCount,
      totalKeyPresses: this.keyPressCount,
      totalMouseMoves: this.mouseMoveCount,
      timeOnPage,
      lastActivityTime: new Date(this.lastActivityTime).toISOString(),
      isActiveNow: this.isActive,
      riskScore: Math.min(activityRiskScore, 30)
    };
  }

  public getRecentActivities(limit: number = 10): UserActivity[] {
    return this.activities.slice(-limit);
  }

  public resetTracker() {
    this.activities = [];
    this.clickCount = 0;
    this.scrollCount = 0;
    this.keyPressCount = 0;
    this.mouseMoveCount = 0;
    this.pageStartTime = Date.now();
    this.lastActivityTime = Date.now();
  }
}

export default new ActivityTracker();
