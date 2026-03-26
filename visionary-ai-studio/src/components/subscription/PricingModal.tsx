'use client';

import React, { useState } from 'react';
import { PLANS, type PlanId } from '@/lib/stripe-client';
import { useSubscription } from '@/lib/SubscriptionContext';
import { Crown, Check, Zap, Building2, X, Loader2, ExternalLink, Coins, Plus } from 'lucide-react';
import styles from './PricingModal.module.css';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const planIcons: Record<PlanId, React.ReactNode> = {
  free: <Zap size={22} />,
  pro: <Crown size={22} />,
  enterprise: <Building2 size={22} />,
};

export default function PricingModal({ isOpen, onClose }: PricingModalProps) {
  const { plan: currentPlan, credits, checkout, openPortal, buyCredits, status } = useSubscription();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleUpgrade = async (planId: PlanId) => {
    if (planId === 'free' || planId === currentPlan) return;
    setLoadingPlan(planId);
    try {
      await checkout(planId);
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleManage = async () => {
    setLoadingPlan('manage');
    try {
      await openPortal();
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleTopUp = async () => {
    setLoadingPlan('topup');
    try {
      await buyCredits();
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h2 className={styles.title}>اختر خطتك</h2>
            <p className={styles.subtitle}>نظام الكريدت — ادفع حسب استخدامك</p>
          </div>
          <div className={styles.headerRight}>
            {/* Credit Balance */}
            <div className={styles.creditBadge}>
              <Coins size={16} />
              <span className={styles.creditCount}>{credits}</span>
              <span className={styles.creditLabel}>كريدت</span>
            </div>
            <button className={styles.closeBtn} onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className={styles.plansGrid}>
          {(Object.keys(PLANS) as PlanId[]).map((planId) => {
            const plan = PLANS[planId];
            const isCurrent = planId === currentPlan;
            const isPopular = plan.popular;

            return (
              <div
                key={planId}
                className={`${styles.planCard} ${isCurrent ? styles.planCardCurrent : ''} ${isPopular ? styles.planCardPopular : ''}`}
              >
                {isPopular && <div className={styles.popularBadge}>الأكثر شعبية</div>}
                {isCurrent && <div className={styles.currentBadge}>خطتك الحالية</div>}

                <div className={styles.planIcon} style={{ color: plan.color }}>
                  {planIcons[planId]}
                </div>

                <h3 className={styles.planName}>{plan.name}</h3>
                <p className={styles.planNameEn}>{plan.nameEn}</p>

                <div className={styles.priceWrap}>
                  {plan.price === 0 ? (
                    <span className={styles.priceAmount}>مجاني</span>
                  ) : (
                    <>
                      <span className={styles.priceCurrency}>$</span>
                      <span className={styles.priceAmount}>{plan.price}</span>
                      <span className={styles.priceInterval}>/شهر</span>
                    </>
                  )}
                </div>

                {/* Credits highlight */}
                <div className={styles.creditsHighlight} style={{ borderColor: `${plan.color}33`, background: `${plan.color}0a` }}>
                  <Coins size={16} style={{ color: plan.color }} />
                  <span className={styles.creditsAmount} style={{ color: plan.color }}>
                    {plan.monthlyCredits.toLocaleString()}
                  </span>
                  <span className={styles.creditsLabel}>كريدت/شهر</span>
                </div>

                <ul className={styles.featureList}>
                  {plan.featuresAr.map((feature, i) => (
                    <li key={i} className={styles.featureItem}>
                      <Check size={14} className={styles.featureCheck} style={{ color: plan.color }} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className={styles.planAction}>
                  {isCurrent && status === 'active' ? (
                    <button
                      className={styles.manageBtn}
                      onClick={handleManage}
                      disabled={loadingPlan !== null}
                    >
                      {loadingPlan === 'manage' ? (
                        <Loader2 size={16} className={styles.spinner} />
                      ) : (
                        <><ExternalLink size={14} /><span>إدارة الاشتراك</span></>
                      )}
                    </button>
                  ) : isCurrent ? (
                    <button className={styles.currentBtn} disabled>خطتك الحالية</button>
                  ) : planId === 'free' ? (
                    <button className={styles.freeBtn} disabled>مجاني</button>
                  ) : (
                    <button
                      className={styles.upgradeBtn}
                      style={{ background: `linear-gradient(135deg, ${plan.color}, ${plan.color}dd)` }}
                      onClick={() => handleUpgrade(planId)}
                      disabled={loadingPlan !== null}
                    >
                      {loadingPlan === planId ? (
                        <Loader2 size={16} className={styles.spinner} />
                      ) : (
                        <span>ترقية الآن</span>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Top-up Section */}
        {currentPlan !== 'free' && (
          <div className={styles.topUpSection}>
            <div className={styles.topUpContent}>
              <div className={styles.topUpInfo}>
                <Plus size={18} />
                <div>
                  <span className={styles.topUpTitle}>شحن كريدت إضافي</span>
                  <span className={styles.topUpDesc}>
                    {currentPlan === 'enterprise' ? '$5 = 150 كريدت' : '$5 = 100 كريدت'}
                  </span>
                </div>
              </div>
              <button
                className={styles.topUpBtn}
                onClick={handleTopUp}
                disabled={loadingPlan !== null}
              >
                {loadingPlan === 'topup' ? (
                  <Loader2 size={14} className={styles.spinner} />
                ) : (
                  <span>شحن الآن</span>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className={styles.footer}>
          <p>جميع الخطط تشمل تجربة مجانية لمدة 7 أيام. يمكنك الإلغاء في أي وقت.</p>
        </div>
      </div>
    </div>
  );
}
