"use client";
import Link from "next/link";

export default function Dashboard() {
  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      background: '#FAFAFB',
      fontFamily: '-apple-system, system-ui, sans-serif'
    }}>
      {/* Left Sidebar */}
      <aside style={{
        width: '280px',
        background: '#FFFFFF',
        borderRight: '1px solid #E5E7EB',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: '#106DE6',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 600
          }}>T</div>
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#1F2937' }}>
            Timeline Assignment Planner
          </span>
        </div>

        {/* Navigation */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            { href: '/dashboard', label: 'Dashboard', icon: '📊', active: true },
            { href: '/assignments/new', label: 'Add Assignment', icon: '+' },
            { href: '/timeline', label: 'Timeline', icon: '📅' },
            { href: '/calendar', label: 'Calendar', icon: '🗓️' },
            { href: '#', label: 'Notifications', icon: '🔔', badge: '2' }
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                borderRadius: '8px',
                color: item.active ? '#106DE6' : '#4B5563',
                background: item.active ? '#EEF5FF' : 'transparent',
                textDecoration: 'none',
                fontWeight: item.active ? 500 : 400,
                position: 'relative'
              }}
            >
              <span style={{ fontSize: '18px' }}>{item.icon}</span>
              <span>{item.label}</span>
              {item.badge && (
                <span style={{
                  marginLeft: 'auto',
                  background: '#EF4444',
                  color: 'white',
                  fontSize: '12px',
                  borderRadius: '12px',
                  padding: '2px 8px'
                }}>{item.badge}</span>
              )}
            </Link>
          ))}
        </nav>

        {/* Quick Stats */}
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{
            padding: '12px',
            background: '#F3F4F6',
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '14px', color: '#4B5563' }}>Active Assignments</span>
            <span style={{
              background: '#106DE6',
              color: 'white',
              fontSize: '12px',
              fontWeight: 600,
              borderRadius: '12px',
              padding: '4px 10px'
            }}>12</span>
          </div>
          <div style={{
            padding: '12px',
            background: '#F3F4F6',
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '14px', color: '#4B5563' }}>Due This Week</span>
            <span style={{
              background: '#F59E0B',
              color: 'white',
              fontSize: '12px',
              fontWeight: 600,
              borderRadius: '12px',
              padding: '4px 10px'
            }}>3</span>
          </div>
        </div>

        {/* User Profile */}
        <div style={{
          marginTop: '24px',
          padding: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: '#106DE6',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 600,
            fontSize: '16px'
          }}>S</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '14px', fontWeight: 500, color: '#1F2937' }}>Student</div>
            <div style={{ fontSize: '12px', color: '#6B7280' }}>Smart planning mode</div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '32px', overflow: 'auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <div>
            <h1 style={{
              fontSize: '32px',
              fontWeight: 600,
              color: '#1F2937',
              marginBottom: '8px'
            }}>Academic Dashboard</h1>
            <p style={{ fontSize: '16px', color: '#6B7280' }}>
              Stay on top of your assignments and deadlines
            </p>
          </div>
          <Link href="/assignments/new" style={{
            padding: '12px 24px',
            background: '#106DE6',
            color: 'white',
            borderRadius: '12px',
            textDecoration: 'none',
            fontWeight: 500,
            fontSize: '14px'
          }}>
            + Add Assignment
          </Link>
        </div>

        {/* Key Metrics Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
          marginBottom: '32px'
        }}>
          {[
            { icon: '📚', title: 'TOTAL ASSIGNMENTS', value: '3', subtitle: '+12 this semester', color: '#106DE6' },
            { icon: '⏰', title: 'DUE THIS WEEK', value: '0', subtitle: '3 need attention', color: '#F59E0B' },
            { icon: '✅', title: 'COMPLETION RATE', value: '0%', subtitle: '87% average', color: '#22C55E' },
            { icon: '⚠️', title: 'AT RISK', value: '0', subtitle: 'Action needed', color: '#EF4444' }
          ].map((metric) => (
            <div key={metric.title} style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div style={{ fontSize: '24px' }}>{metric.icon}</div>
              <div>
                <div style={{
                  fontSize: '12px',
                  color: '#6B7280',
                  fontWeight: 500,
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>{metric.title}</div>
                <div style={{
                  fontSize: '32px',
                  fontWeight: 600,
                  color: '#1F2937',
                  marginBottom: '4px'
                }}>{metric.value}</div>
                <div style={{
                  fontSize: '14px',
                  color: '#6B7280'
                }}>{metric.subtitle}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Upcoming Deadlines & Courses */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Upcoming Deadlines */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            border: '1px solid #D1FAE5'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px'
            }}>
              <span style={{ fontSize: '20px' }}>🎯</span>
              <h2 style={{
                fontSize: '18px',
                fontWeight: 600,
                color: '#1F2937'
              }}>Upcoming Deadlines</h2>
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '32px',
              color: '#6B7280'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏰</div>
              <p style={{ fontSize: '16px', textAlign: 'center' }}>
                All caught up! No immediate deadlines this week.
              </p>
            </div>
          </div>

          {/* Your Courses */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
          }}>
            <h2 style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#1F2937',
              marginBottom: '16px'
            }}>Your Courses</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{
                padding: '16px',
                background: '#F3F4F6',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: '#106DE6',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px'
                }}>📚</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: '#1F2937' }}>
                    Introduction to Co...
                  </div>
                  <div style={{ fontSize: '12px', color: '#6B7280' }}>
                    CS 101 • Dr. Sarah Johnson
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#1F2937' }}>0 total</div>
                  <div style={{ fontSize: '12px', color: '#6B7280' }}>Fall 2024</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

