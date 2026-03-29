import React, { useState, useRef, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonButton,
  IonCard,
  IonCardContent,
  IonText
} from '@ionic/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import PixelMap from '../components/PixelMap';
import 'swiper/css';
import './Home.css';

const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const tabs = ['Dashboard', '🇺🇸 USA', 'Calendar', 'Profile'];

  useEffect(() => {
    const activeBtn = tabRefs.current[activeTab];
    if (activeBtn) {
      // Use requestAnimationFrame to ensure layout is computed before scrolling
      requestAnimationFrame(() => {
        activeBtn.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest'
        });
      });
    }
  }, [activeTab]);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
    if (swiperRef.current) {
      swiperRef.current.slideTo(index);
    }
  };

  const handleSlideChange = (swiper: SwiperType) => {
    setActiveTab(swiper.activeIndex);
  };

  return (
    <IonPage className="trivo-page">
      <IonHeader className="ion-no-border">
        <IonToolbar className="trivo-toolbar">
          <div className="tab-container">
            {tabs.map((tab, index) => (
              <button
                key={tab}
                ref={el => { tabRefs.current[index] = el; }}
                className={`tab-button ${activeTab === index ? 'active' : ''}`}
                onClick={() => handleTabClick(index)}
              >
                {tab}
              </button>
            ))}
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen forceOverscroll={false} scrollY={false}>
        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={handleSlideChange}
          style={{ height: '100%' }}
        >
          {/* Dashboard Slide */}
          <SwiperSlide>
            <div className="slide-content">
              <div className="map-section">
                <div className="map-overlay-left"></div>
                <div className="map-overlay-right"></div>
                <PixelMap />
              </div>

              <div className="content-container">
                <IonText color="muted" className="section-title">
                  <p>Upcoming trips</p>
                </IonText>

                <IonCard className="trip-card">
                  <IonCardContent>
                    <div className="empty-state-container">
                      <img src="/Empty.png" alt="No trips" className="empty-state-image" />
                    </div>

                    <IonButton expand="block" mode="ios" className="create-trip-button">
                      Create new trip
                    </IonButton>
                  </IonCardContent>
                </IonCard>
              </div>
            </div>
          </SwiperSlide>

          {/* USA Slide */}
          <SwiperSlide>
            <div className="slide-content usa-slide">
              <div className="usa-empty-state">
                <img src="/Tree.png" alt="Oasis" className="usa-tree-image" />
                <h2 className="usa-title">No Activities</h2>
                <p className="usa-subtitle">Add to your trip to organize your itinerary</p>
              </div>

              <div className="add-to-trip-footer">
                <button className="add-trip-btn">
                  <span className="plus-icon">+</span>
                  Add to Trip
                </button>
              </div>
            </div>
          </SwiperSlide>

          {/* Calendar Slide */}
          <SwiperSlide>
            <div className="slide-content centered">
              <div className="placeholder-view">
                <div className="icon-large">📅</div>
                <h2>Calendar</h2>
                <p>Your scheduled trips will appear here.</p>
              </div>
            </div>
          </SwiperSlide>

          {/* Profile Slide */}
          <SwiperSlide>
            <div className="slide-content centered">
              <div className="placeholder-view">
                <div className="icon-large">👤</div>
                <h2>Profile</h2>
                <p>Manage your account and preferences.</p>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </IonContent>
    </IonPage>
  );
};

export default Home;
