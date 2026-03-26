'use client';

import React, { useState } from 'react';
import { useAppStore, TOOLS, TOOL_CATEGORIES } from '@/store/useAppStore';
import { useAuth } from '@/lib/AuthContext';
import { useSubscription } from '@/lib/SubscriptionContext';
import { PLANS } from '@/lib/stripe-client';
import PricingModal from '@/components/subscription/PricingModal';
import {
  Sparkles, Film, BarChart3, Camera, Palette,
  Target, Megaphone, Wand2, Mic, Video, Globe, Send,
  ChevronDown, LayoutDashboard, TrendingUp, LayoutGrid, Brush,
  Bell, Search, User, Settings, LogOut, Crown, Coins,
} from 'lucide-react';
import styles from './TopNav.module.css';

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Sparkles, Film, BarChart3, Camera, Palette, Target, Megaphone, Wand2, Mic, Video, Globe, Send,
  TrendingUp, LayoutGrid, Brush,
};

export default function TopNav() {
  const { activeTool, setActiveTool } = useAppStore();
  const { user, signOut } = useAuth();
  const { plan: currentPlan, credits } = useSubscription();
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPricing, setShowPricing] = useState(false);

  const currentPlanInfo = PLANS[currentPlan];

  const activeToolDef = TOOLS.find(t => t.id === activeTool);

  return (
    <nav className={styles.topNav}>
      {/* Logo */}
      <div className={styles.logo} onClick={() => setActiveTool('dashboard')} style={{ cursor: 'pointer' }}>
        <div className={styles.logoIcon}>
          <span className={styles.logoLetter}>M</span>
        </div>
        <span className={styles.logoText}>
          Mo3in<span className={styles.logoAi}>AI</span>
        </span>
      </div>

      {/* Navigation */}
      <div className={styles.tools}>
        <button
          className={`${styles.homeBtn} ${activeTool === 'dashboard' ? styles.homeBtnActive : ''}`}
          onClick={() => setActiveTool('dashboard')}
        >
          <LayoutDashboard size={15} />
          <span>الرئيسية</span>
        </button>
        <div className={styles.divider} />
        {TOOL_CATEGORIES.map((cat) => {
          const categoryTools = TOOLS.filter(t => t.category === cat.id);
          const hasActiveTool = categoryTools.some(t => t.id === activeTool);
          const isOpen = openCategory === cat.id;

          return (
            <div
              key={cat.id}
              className={styles.categoryWrap}
              onMouseEnter={() => setOpenCategory(cat.id)}
              onMouseLeave={() => setOpenCategory(null)}
            >
              <button
                className={`${styles.categoryBtn} ${hasActiveTool ? styles.categoryBtnActive : ''}`}
              >
                <span className={styles.categoryLabel}>{cat.nameAr}</span>
                <ChevronDown size={12} className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`} />
              </button>

              {isOpen && (
                <div className={styles.dropdown}>
                  <div className={styles.dropdownHeader}>{cat.name}</div>
                  {categoryTools.map((tool) => {
                    const IconComponent = iconMap[tool.icon];
                    const isActive = activeTool === tool.id;
                    if (!IconComponent) return null;
                    return (
                      <button
                        key={tool.id}
                        id={`nav-tool-${tool.id}`}
                        className={`${styles.dropdownItem} ${isActive ? styles.dropdownItemActive : ''}`}
                        onClick={() => { setActiveTool(tool.id); setOpenCategory(null); }}
                      >
                        <IconComponent size={15} />
                        <div className={styles.dropdownItemText}>
                          <span className={styles.dropdownItemName}>{tool.name}</span>
                          <span className={styles.dropdownItemNameAr}>{tool.nameAr}</span>
                        </div>
                        {isActive && <div className={styles.activeDot} />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Active tool indicator */}
      {activeToolDef && activeTool !== 'dashboard' && (
        <div className={styles.activeIndicator}>
          {(() => {
            const Icon = iconMap[activeToolDef.icon];
            return Icon ? <Icon size={14} /> : null;
          })()}
          <span>{activeToolDef.nameAr}</span>
        </div>
      )}

      {/* Right Section */}
      <div className={styles.right}>
        {/* Credit Balance */}
        <button className={styles.creditBtn} onClick={() => setShowPricing(true)}>
          <Coins size={14} />
          <span className={styles.creditNum}>{credits}</span>
        </button>

        {/* Notifications */}
        <div className={styles.iconBtnWrap}
          onMouseEnter={() => setShowNotifications(true)}
          onMouseLeave={() => setShowNotifications(false)}
        >
          <button className={styles.iconBtn}>
            <Bell size={17} />
            <span className={styles.notifDot} />
          </button>
          {showNotifications && (
            <div className={styles.notifDropdown}>
              <div className={styles.notifHeader}>الإشعارات</div>
              <div className={styles.notifItem}>
                <div className={styles.notifDotSmall} style={{ background: '#10B981' }} />
                <div className={styles.notifContent}>
                  <span>تم نشر البوست بنجاح</span>
                  <span className={styles.notifTime}>منذ 5 دقائق</span>
                </div>
              </div>
              <div className={styles.notifItem}>
                <div className={styles.notifDotSmall} style={{ background: '#8B5CF6' }} />
                <div className={styles.notifContent}>
                  <span>تم توليد 4 تصاميم جديدة</span>
                  <span className={styles.notifTime}>منذ ساعة</span>
                </div>
              </div>
              <div className={styles.notifItem}>
                <div className={styles.notifDotSmall} style={{ background: '#F59E0B' }} />
                <div className={styles.notifContent}>
                  <span>اقتربت من حد الاستخدام (80%)</span>
                  <span className={styles.notifTime}>منذ 3 ساعات</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className={styles.profileWrap}
          onMouseEnter={() => setShowUserMenu(true)}
          onMouseLeave={() => setShowUserMenu(false)}
        >
          <button className={styles.profileBtn}>
            <div className={styles.avatar}>
              <User size={15} />
            </div>
            <ChevronDown size={11} className={styles.profileChevron} />
          </button>

          {showUserMenu && (
            <div className={styles.userDropdown}>
              <div className={styles.userInfo}>
                <div className={styles.userAvatar}>
                  <User size={20} />
                </div>
                <div className={styles.userDetails}>
                  <span className={styles.userName}>{user?.user_metadata?.full_name || 'مستخدم Mo3in'}</span>
                  <span className={styles.userEmail}>{user?.email || 'user@mo3in.ai'}</span>
                </div>
              </div>
              <div className={styles.userDivider} />
              <div className={styles.planBadge}>
                <Crown size={12} />
                <span>{currentPlanInfo.name}</span>
                {currentPlan === 'free' && (
                  <button className={styles.upgradeMini} onClick={() => { setShowPricing(true); setShowUserMenu(false); }}>ترقية</button>
                )}
              </div>
              <div className={styles.userDivider} />
              <button className={styles.userMenuItem}>
                <Settings size={14} /> الإعدادات
              </button>
              <button className={`${styles.userMenuItem} ${styles.logoutBtn}`} onClick={() => signOut()}>
                <LogOut size={14} /> تسجيل الخروج
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Pricing Modal */}
      <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} />
    </nav>
  );
}
