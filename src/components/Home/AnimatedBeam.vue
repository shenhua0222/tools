<template>
  <svg
    :width="svgDimensions.width"
    :height="svgDimensions.height"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    :class="cn('animated-beam', className)"
    :viewBox="`0 0 ${svgDimensions.width} ${svgDimensions.height}`"
  >
    <defs>
      <filter 
        v-if="enableGlow" 
        :id="`glow-${gradientId}`" 
        x="-50%" 
        y="-50%" 
        width="200%" 
        height="200%"
      >
        <feGaussianBlur 
          stdDeviation="3" 
          result="coloredBlur"
        />
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      
      <filter 
        v-if="enableMotionBlur" 
        :id="`motion-blur-${gradientId}`"
        x="-20%" 
        y="-20%" 
        width="140%" 
        height="140%"
      >
        <feGaussianBlur 
          :stdDeviation="`${motionBlurIntensity}, 0`" 
          result="blur"
        />
        <feOffset 
          :dx="reverse ? -motionBlurOffset : motionBlurOffset" 
          dy="0" 
          result="offset"
        />
        <feMerge>
          <feMergeNode in="offset"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>

      <linearGradient
        :id="gradientId"
        gradientUnits="userSpaceOnUse"
        :x1="gradientCoords.x1"
        :y1="gradientCoords.y1"
        :x2="gradientCoords.x2"
        :y2="gradientCoords.y2"
      >
        <stop 
          :offset="`${Math.max(0, Math.min(100, beamHeadOffset - beamLength * 100))}%`"
          :stop-color="gradientStartColor" 
          stop-opacity="0"
        />
        <stop 
          :offset="`${Math.max(0, Math.min(100, beamHeadOffset - beamLength * 50))}%`"
          :stop-color="gradientStopColor"
          :stop-opacity="beamIntensity"
        />
        <stop
          :offset="`${Math.max(0, Math.min(100, beamHeadOffset))}%`"
          :stop-color="gradientStopColor"
          stop-opacity="0"
        />
      </linearGradient>
      
      <linearGradient
        v-if="enableInnerBeam"
        :id="`${gradientId}-inner`"
        gradientUnits="userSpaceOnUse"
        :x1="gradientCoords.x1"
        :y1="gradientCoords.y1"
        :x2="gradientCoords.x2"
        :y2="gradientCoords.y2"
      >
        <stop 
          :offset="`${Math.max(0, Math.min(100, beamHeadOffsetInner - beamCoreLength * 100))}%`"
          :stop-color="gradientStopColor" 
          stop-opacity="0" 
        />
        <stop 
          :offset="`${Math.max(0, Math.min(100, beamHeadOffsetInner - beamCoreLength * 60))}%`"
          :stop-color="gradientStopColor" 
          :stop-opacity="beamIntensity * 0.8" 
        />
        <stop 
          :offset="`${Math.max(0, Math.min(100, beamHeadOffsetInner - beamCoreLength * 30))}%`"
          :stop-color="gradientStopColor" 
          :stop-opacity="beamIntensity * 1.2" 
        />
        <stop 
          :offset="`${Math.max(0, Math.min(100, beamHeadOffsetInner))}%`"
          :stop-color="gradientStopColor" 
          stop-opacity="0" 
        />
      </linearGradient>

      <radialGradient 
        v-if="enableParticles"
        :id="`particle-${gradientId}`"
      >
        <stop
offset="0%"
:stop-color="gradientStopColor"
:stop-opacity="particleOpacity"/>
        <stop
offset="100%"
:stop-color="gradientStopColor"
stop-opacity="0"/>
      </radialGradient>
    </defs>

    <path
      :d="pathD"
      :stroke="pathColor"
      :stroke-width="pathWidth"
      :stroke-opacity="pathOpacity"
      stroke-linecap="round"
    />
    
    <path
      v-if="enableGlow"
      :d="pathD"
      :stroke-width="pathWidth * beamHeadWidth * glowSize"
      :stroke="`url(#${gradientId})`"
      :stroke-opacity="beamIntensity * 0.3"
      stroke-linecap="round"
      :filter="`url(#glow-${gradientId})`"
      class="glow-layer"
    />
    
    <path
      :d="pathD"
      :stroke-width="pathWidth * beamHeadWidth"
      :stroke="`url(#${gradientId})`"
      :stroke-opacity="currentIntensity"
      stroke-linecap="round"
      :filter="enableMotionBlur ? `url(#motion-blur-${gradientId})` : undefined"
      class="main-beam"
      @mouseenter="onBeamHover(true)"
      @mouseleave="onBeamHover(false)"
    />
    
    <path
      v-if="enableInnerBeam"
      :d="pathD"
      :stroke-width="Math.max(1, pathWidth * beamCoreSize)"
      :stroke="`url(#${gradientId}-inner)`"
      :stroke-opacity="beamIntensity * 1.2"
      stroke-linecap="round"
      class="inner-beam"
    />

    <g v-if="enableParticles && particles.length > 0">
      <circle
        v-for="particle in particles"
        :key="particle.id"
        :cx="particle.x"
        :cy="particle.y"
        :r="particle.size"
        :fill="`url(#particle-${gradientId})`"
        :opacity="particle.opacity"
        class="particle"
      />
    </g>

    <g
v-if="enablePulse && pulsePosition"
class="pulse-group">
      <circle
          v-show="currentPulseOpacity > 0"
          :cx="pulsePosition.x"
          :cy="pulsePosition.y"
          :r="pulseRadius * 1.2"
          fill="none"
          :stroke="gradientStopColor"
          :stroke-width="2"
          :opacity="currentPulseOpacity * 0.3"
          class="pulse-ring-outer"
        />
        <circle
          v-show="currentPulseOpacity > 0"
          :cx="pulsePosition.x"
          :cy="pulsePosition.y"
          :r="pulseRadius * 0.8"
          fill="none"
          :stroke="gradientStopColor"
          :stroke-width="1.5"
          :opacity="currentPulseOpacity * 0.6"
          class="pulse-ring-middle"
        />
        <circle
          v-show="currentPulseOpacity > 0"
          :cx="pulsePosition.x"
          :cy="pulsePosition.y"
          :r="pulseRadius * 0.4"
          :fill="gradientStopColor"
          :opacity="currentPulseOpacity"
          class="pulse-core"
          :filter="enableGlow ? `url(#glow-${gradientId})` : undefined"
        />
        <g
          v-show="currentPulseOpacity > 0.3"
          :opacity="currentPulseOpacity * 0.8">
        <line
          :x1="pulsePosition.x - pulseRadius * 0.6"
          :y1="pulsePosition.y"
          :x2="pulsePosition.x + pulseRadius * 0.6"
          :y2="pulsePosition.y"
          :stroke="gradientStopColor"
          stroke-width="1"
          class="pulse-crosshair"
        />
        <line
          :x1="pulsePosition.x"
          :y1="pulsePosition.y - pulseRadius * 0.6"
          :x2="pulsePosition.x"
          :y2="pulsePosition.y + pulseRadius * 0.6"
          :stroke="gradientStopColor"
          stroke-width="1"
          class="pulse-crosshair"
        />
      </g>
    </g>
  </svg>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { gsap } from 'gsap';
import { cn } from '@/utils/classNames';

interface BeamProps {
  className?: string
  containerRef: HTMLElement | null
  fromRef: HTMLElement | null
  toRef: HTMLElement | null
  curvature?: number
  reverse?: boolean
  pathColor?: string
  pathWidth?: number
  pathOpacity?: number
  gradientStartColor?: string
  gradientStopColor?: string
  delay?: number
  duration?: number
  startXOffset?: number
  startYOffset?: number
  endXOffset?: number
  endYOffset?: number
  
  beamLength?: number
  beamHeadWidth?: number
  beamTailWidth?: number
  beamIntensity?: number
  beamFadeStart?: number
  beamFadeEnd?: number
  beamCoreSize?: number
  beamGlowSize?: number
  enableInnerBeam?: boolean
  beamSpeedRatio?: number
  enableGlow?: boolean
  enableMotionBlur?: boolean
  motionBlurIntensity?: number
  motionBlurOffset?: number
  enableParticles?: boolean
  particleOpacity?: number
  particleCount?: number
  particleSize?: number
  particleSpeed?: number
  enablePulse?: boolean
  pulseOpacity?: number
  pulseInterval?: number
  pulseDuration?: number
  pulseSize?: number
  pulseDelay?: number
  
  animationMode?: 'linear' | 'ease' | 'bounce' | 'wave' | 'spiral'
  enableHoverEffect?: boolean
  hoverIntensityMultiplier?: number
  pathType?: 'linear' | 'quadratic' | 'cubic'
  controlPoints?: Array<{x: number, y: number}>
  glowSize?: number
  
  enableRightAngle?: boolean
  turnPosition?: number
  turnDirection?: 'horizontal-first' | 'vertical-first'
  cornerRadius?: number
  
  performanceMode?: 'high' | 'medium' | 'low'
  enableOptimizations?: boolean
}

const props = withDefaults(defineProps<BeamProps>(), {
  curvature: 0,
  reverse: false,
  duration: () => Math.random() * 2 + 3,
  delay: 0,
  pathColor: '#2571b6',
  pathWidth: 8,
  pathOpacity: 0.8,
  gradientStartColor: '#ff6b6b',
  gradientStopColor: '#4ecdc4',
  startXOffset: 0,
  startYOffset: 0,
  endXOffset: 0,
  endYOffset: 0,
  
  beamLength: 0.4,
  beamHeadWidth: 1.2,
  beamTailWidth: 0.3,
  beamIntensity: 0.8,
  beamFadeStart: 0.1,
  beamFadeEnd: 0.9,
  beamCoreSize: 0.4,
  beamGlowSize: 2.0,
  enableInnerBeam: false,
  beamSpeedRatio: 0.7,
  
  enableGlow: false,
  glowSize: 2.0,
  enableMotionBlur: false,
  motionBlurIntensity: 10,
  motionBlurOffset: 5,
  
  enableParticles: false,
  particleCount: 4,
  particleSize: 2,
  particleOpacity: 0.7,
  particleSpeed: 1,
  
  enablePulse: false,
  pulseInterval: 2.0,
  pulseDuration: 0.8,
  pulseSize: 10,
  pulseOpacity: 0.6,
  pulseDelay: 0,
  
  animationMode: 'linear',
  enableHoverEffect: false,
  hoverIntensityMultiplier: 1.2,
  
  pathType: 'quadratic',
  controlPoints: undefined,
  
  enableRightAngle: false,
  turnPosition: 0.5,
  turnDirection: 'horizontal-first',
  cornerRadius: 0,
  
  performanceMode: 'medium',
  enableOptimizations: true
});

const performanceSettings = computed(() => {
  const mode = props.performanceMode;
  const optimizations = props.enableOptimizations;
  
  if (!optimizations) {
    return {
      enableGlow: props.enableGlow,
      enableInnerBeam: props.enableInnerBeam,
      enableParticles: props.enableParticles,
      enablePulse: props.enablePulse,
      enableMotionBlur: props.enableMotionBlur,
      particleCount: props.particleCount,
      updateInterval: 16
    };
  }
  
  switch (mode) {
    case 'high':
      return {
        enableGlow: props.enableGlow,
        enableInnerBeam: props.enableInnerBeam,
        enableParticles: props.enableParticles,
        enablePulse: props.enablePulse,
        enableMotionBlur: props.enableMotionBlur,
        particleCount: Math.min(props.particleCount, 6),
        updateInterval: 16
      };
    case 'medium':
      return {
        enableGlow: false,
        enableInnerBeam: props.enableInnerBeam,
        enableParticles: props.enableParticles,
        enablePulse: props.enablePulse,
        enableMotionBlur: false,
        particleCount: Math.min(props.particleCount, 4),
        updateInterval: 32
      };
    case 'low':
      return {
        enableGlow: false,
        enableInnerBeam: false,
        enableParticles: false,
        enablePulse: false,
        enableMotionBlur: false,
        particleCount: 0,
        updateInterval: 64
      };
    default:
      return {
        enableGlow: false,
        enableInnerBeam: false,
        enableParticles: false,
        enablePulse: false,
        enableMotionBlur: false,
        particleCount: 0,
        updateInterval: 32
      };
  }
});

const pathD = ref('');
const svgDimensions = ref({ width: 0, height: 0 });

const beamHeadOffset = ref(0);
const beamHeadOffsetInner = ref(0);

type Particle = {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  progress: number;
}

const particles = ref<Particle[]>([]);

const pulsePosition = ref<{x: number, y: number} | null>(null);
const pulseRadius = ref(0);
const currentPulseOpacity = ref(0);

const isHovered = ref(false);
const currentIntensity = ref(props.beamIntensity);

const gradientId = computed(() => `gradient-${Math.random().toString(36).substr(2, 9)}`);

const beamCoreLength = computed(() => props.beamLength * props.beamCoreSize);

const glowSize = computed(() => props.beamGlowSize || 2.0);

const effectiveIntensity = computed(() => {
  const base = props.beamIntensity;
  const hover = isHovered.value ? (props.hoverIntensityMultiplier || 1.5) : 1;
  return Math.min(1, base * hover);
});

let mainGradientAnimation: gsap.core.Tween | null = null;
let innerGradientAnimation: gsap.core.Tween | null = null;
let particleAnimation: gsap.core.Timeline | null = null;
let pulseAnimation: gsap.core.Timeline | null = null;
let resizeObserver: ResizeObserver | null = null;

let lastUpdateTime = 0;
const updateParticlesThrottled = () => {
  if (!performanceSettings.value.enableParticles) return;
  
  const now = Date.now();
  if (now - lastUpdateTime < performanceSettings.value.updateInterval) return;
  lastUpdateTime = now;
  
  updateParticles();
};

const onBeamHover = (hover: boolean) => {
  if (!props.enableHoverEffect) {return;}
  
  isHovered.value = hover;
  
  const targetIntensity = hover ? effectiveIntensity.value : props.beamIntensity;
  
  gsap.to(currentIntensity, {
    value: targetIntensity,
    duration: 0.2,
    ease: 'power2.out'
  });
};

const pathCache = new Map<string, {x: number, y: number}>();

const getPointOnPath = (progress: number): {x: number, y: number} => {
  if (!pathD.value || !props.containerRef || !props.fromRef || !props.toRef) {
    return {x: 0, y: 0};
  }
  
  const cacheKey = `${progress.toFixed(3)}`;
  if (pathCache.has(cacheKey)) {
    return pathCache.get(cacheKey)!;
  }
  
  try {
    const containerRect = props.containerRef.getBoundingClientRect();
    const fromRect = props.fromRef.getBoundingClientRect();
    const toRect = props.toRef.getBoundingClientRect();
    
    const startX = fromRect.left - containerRect.left + fromRect.width / 2 + props.startXOffset;
    const startY = fromRect.top - containerRect.top + fromRect.height / 2 + props.startYOffset;
    const endX = toRect.left - containerRect.left + toRect.width / 2 + props.endXOffset;
    const endY = toRect.top - containerRect.top + toRect.height / 2 + props.endYOffset;

    const t = Math.max(0, Math.min(1, progress));
    
    let result: {x: number, y: number};
    
    if (props.enableRightAngle) {
      const turnPos = Math.max(0, Math.min(1, props.turnPosition || 0.5));
      const radius = Math.max(0, props.cornerRadius || 0);
      
      if (props.turnDirection === 'horizontal-first') {
        const turnX = startX + (endX - startX) * turnPos;
        const turnY = startY;
        
        if (radius > 0) {
          const isGoingRight = endX > startX;
          const isGoingDown = endY > startY;
          
          const radiusX = Math.min(radius, Math.abs(turnX - startX));
          const radiusY = Math.min(radius, Math.abs(endY - turnY));
          const actualRadius = Math.min(radiusX, radiusY);
          
          if (actualRadius > 0) {
            const hSegmentLength = Math.abs(turnX - startX) - actualRadius;
            const vSegmentLength = Math.abs(endY - turnY) - actualRadius;
            const arcLength = (actualRadius * Math.PI) / 2;
            const totalLength = hSegmentLength + arcLength + vSegmentLength;
            
            const currentDistance = t * totalLength;
            
            if (currentDistance <= hSegmentLength) {
              const segmentProgress = currentDistance / hSegmentLength;
              result = {
                x: startX + (isGoingRight ? hSegmentLength * segmentProgress : -hSegmentLength * segmentProgress),
                y: startY
              };
            } else if (currentDistance <= hSegmentLength + arcLength) {
              const arcProgress = (currentDistance - hSegmentLength) / arcLength;
              const angle = arcProgress * Math.PI / 2;
              
              const centerX = turnX - (isGoingRight ? actualRadius : -actualRadius);
              const centerY = turnY + (isGoingDown ? actualRadius : -actualRadius);
              
              let x, y;
              if (isGoingRight && isGoingDown) {
                x = centerX + actualRadius * Math.cos(Math.PI / 2 - angle);
                y = centerY - actualRadius * Math.sin(Math.PI / 2 - angle);
              } else if (!isGoingRight && isGoingDown) {
                x = centerX - actualRadius * Math.cos(Math.PI / 2 + angle);
                y = centerY - actualRadius * Math.sin(Math.PI / 2 + angle);
              } else if (isGoingRight && !isGoingDown) {
                x = centerX + actualRadius * Math.cos(Math.PI / 2 + angle);
                y = centerY + actualRadius * Math.sin(Math.PI / 2 + angle);
              } else {
                x = centerX - actualRadius * Math.cos(Math.PI / 2 - angle);
                y = centerY + actualRadius * Math.sin(Math.PI / 2 - angle);
              }
              
              result = { x, y };
            } else {
              const segmentProgress = (currentDistance - hSegmentLength - arcLength) / vSegmentLength;
              const vStartY = turnY + (isGoingDown ? actualRadius : -actualRadius);
              result = {
                x: turnX,
                y: vStartY + (isGoingDown ? vSegmentLength * segmentProgress : -vSegmentLength * segmentProgress)
              };
            }
          } else {
            if (t <= turnPos) {
              const segmentProgress = t / turnPos;
              result = {
                x: startX + (turnX - startX) * segmentProgress,
                y: startY
              };
            } else {
              const segmentProgress = (t - turnPos) / (1 - turnPos);
              result = {
                x: turnX,
                y: turnY + (endY - turnY) * segmentProgress
              };
            }
          }
        } else {
          if (t <= turnPos) {
            const segmentProgress = t / turnPos;
            result = {
              x: startX + (turnX - startX) * segmentProgress,
              y: startY
            };
          } else {
            const segmentProgress = (t - turnPos) / (1 - turnPos);
            result = {
              x: turnX,
              y: turnY + (endY - turnY) * segmentProgress
            };
          }
        }
      } else {
        const turnX = startX;
        const turnY = startY + (endY - startY) * turnPos;
        
        if (radius > 0) {
          const isGoingDown = endY > startY;
          const isGoingRight = endX > startX;
          
          const radiusY = Math.min(radius, Math.abs(turnY - startY));
          const radiusX = Math.min(radius, Math.abs(endX - turnX));
          const actualRadius = Math.min(radiusY, radiusX);
          
          if (actualRadius > 0) {
            const vSegmentLength = Math.abs(turnY - startY) - actualRadius;
            const hSegmentLength = Math.abs(endX - turnX) - actualRadius;
            const arcLength = (actualRadius * Math.PI) / 2;
            const totalLength = vSegmentLength + arcLength + hSegmentLength;
            
            const currentDistance = t * totalLength;
            
            if (currentDistance <= vSegmentLength) {
              const segmentProgress = currentDistance / vSegmentLength;
              result = {
                x: startX,
                y: startY + (isGoingDown ? vSegmentLength * segmentProgress : -vSegmentLength * segmentProgress)
              };
            } else if (currentDistance <= vSegmentLength + arcLength) {
              const arcProgress = (currentDistance - vSegmentLength) / arcLength;
              const angle = arcProgress * Math.PI / 2;
              
              const centerX = turnX + (isGoingRight ? actualRadius : -actualRadius);
              const centerY = turnY - (isGoingDown ? actualRadius : -actualRadius);
              
              let x, y;
              if (isGoingDown && isGoingRight) {
                x = centerX - actualRadius * Math.sin(angle);
                y = centerY + actualRadius * Math.cos(angle);
              } else if (isGoingDown && !isGoingRight) {
                x = centerX + actualRadius * Math.sin(angle);
                y = centerY + actualRadius * Math.cos(angle);
              } else if (!isGoingDown && isGoingRight) {
                x = centerX - actualRadius * Math.sin(angle);
                y = centerY - actualRadius * Math.cos(angle);
              } else {
                x = centerX + actualRadius * Math.sin(angle);
                y = centerY - actualRadius * Math.cos(angle);
              }
              
              result = { x, y };
            } else {
              const segmentProgress = (currentDistance - vSegmentLength - arcLength) / hSegmentLength;
              const hStartX = turnX + (isGoingRight ? actualRadius : -actualRadius);
              result = {
                x: hStartX + (isGoingRight ? hSegmentLength * segmentProgress : -hSegmentLength * segmentProgress),
                y: turnY
              };
            }
          } else {
            if (t <= turnPos) {
              const segmentProgress = t / turnPos;
              result = {
                x: startX,
                y: startY + (turnY - startY) * segmentProgress
              };
            } else {
              const segmentProgress = (t - turnPos) / (1 - turnPos);
              result = {
                x: turnX + (endX - turnX) * segmentProgress,
                y: turnY
              };
            }
          }
        } else {
          if (t <= turnPos) {
            const segmentProgress = t / turnPos;
            result = {
              x: startX,
              y: startY + (turnY - startY) * segmentProgress
            };
          } else {
            const segmentProgress = (t - turnPos) / (1 - turnPos);
            result = {
              x: turnX + (endX - turnX) * segmentProgress,
              y: turnY
            };
          }
        }
      }
    } else {
      if (props.curvature === 0) {
        const x = startX + (endX - startX) * t;
        const y = startY + (endY - startY) * t;
        
        result = {x, y};
      } else {
        const controlX = (startX + endX) / 2;
        const controlY = startY - props.curvature;
        
        const x = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * controlX + t * t * endX;
        const y = (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * controlY + t * t * endY;
        
        result = {x, y};
      }
    }
    
    pathCache.set(cacheKey, result);
    
    if (pathCache.size > 100) {
      const firstKey = pathCache.keys().next().value;
      pathCache.delete(firstKey);
    }
    
    return result;
  } catch (error) {
    console.warn('Error calculating point on path:', error);
    return {x: 0, y: 0};
  }
};

const initParticles = () => {
  if (!performanceSettings.value.enableParticles) {return;}
  
  particles.value = [];
  const count = performanceSettings.value.particleCount;
  
  const startProgress = props.reverse ? 1 : 0;
  
  for (let i = 0; i < count; i++) {
    particles.value.push({
      id: i,
      x: 0,
      y: 0,
      size: (props.particleSize || 2) * (0.5 + Math.random() * 0.5),
      opacity: 0,
      progress: startProgress
    });
  }
};

const updateParticles = () => {
  if (!performanceSettings.value.enableParticles || particles.value.length === 0) {return;}
  
  particles.value.forEach(particle => {
    const position = getPointOnPath(particle.progress);
    particle.x = position.x;
    particle.y = position.y;
    
    const beamCenter = beamHeadOffset.value / 100;
    const distance = Math.abs(particle.progress - beamCenter);
    const maxDistance = props.beamLength * 0.5;
    
    if (distance < maxDistance) {
      particle.opacity = (1 - distance / maxDistance) * (props.particleOpacity || 0.7);
    } else {
      particle.opacity = 0;
    }
  });
};

const startParticleAnimation = () => {
  if (!performanceSettings.value.enableParticles) {return;}
  
  if (particleAnimation) {
    particleAnimation.kill();
  }
  
  particles.value.forEach((particle, index) => {
    const createParticleLoop = () => {
      const startProgress = props.reverse ? 1 : 0;
      const endProgress = props.reverse ? 0 : 1;
      const particleDelay = (props.duration / particles.value.length) * index;
      
      particle.progress = startProgress;
      
      gsap.to(particle, {
        progress: endProgress,
        duration: props.duration * (props.particleSpeed || 1),
        delay: particleDelay,
        ease: 'none',
        onUpdate: updateParticlesThrottled,
        onComplete: () => {
          createParticleLoop();
        }
      });
    };
    
    createParticleLoop();
  });
};

const startPulseAnimation = () => {
  if (!performanceSettings.value.enablePulse) {
    pulsePosition.value = null;
    pulseRadius.value = 0;
    currentPulseOpacity.value = 0;
    return;
  }
  
  if (pulseAnimation) {
    pulseAnimation.kill();
  }
  
  const pulseDelay = props.pulseDelay || 0;
  pulseAnimation = gsap.timeline({ repeat: -1, delay: pulseDelay });
  
  const interval = props.pulseInterval || 1.5;
  const duration = props.pulseDuration || 1.0;
  const maxSize = props.pulseSize || 15;
  const pulseMaxOpacity = props.pulseOpacity || 0.8;
  
  const pulseProgressPoints = [0.5];
  let currentPulseIndex = 0;
  
  const createPulse = () => {
    const progress = pulseProgressPoints[currentPulseIndex];
    const position = getPointOnPath(progress);
    
    if (position.x === 0 && position.y === 0) {
      return gsap.timeline();
    }
    
    pulsePosition.value = position;
    
    pulseRadius.value = 2;
    currentPulseOpacity.value = 0;
    
    const tl = gsap.timeline();
    
    tl.to([pulseRadius, currentPulseOpacity], {
      value: [maxSize * 0.3, pulseMaxOpacity],
      duration: duration * 0.15,
      ease: 'power3.out'
    })
    .to(pulseRadius, {
      value: maxSize,
      duration: duration * 0.4,
      ease: 'power2.out'
    }, 0.1)
    .to({}, { duration: duration * 0.2 })
    .to(currentPulseOpacity, {
      value: 0,
      duration: duration * 0.25,
      ease: 'power2.in'
    })
    .set([pulseRadius, currentPulseOpacity], { value: 0 });
    
    currentPulseIndex = (currentPulseIndex + 1) % pulseProgressPoints.length;
    
    return tl;
  };
  
  const startPulseSequence = () => {
    if (!pathD.value) {
      setTimeout(startPulseSequence, 100);
      return;
    }
    
    const firstPulse = createPulse();
    if (firstPulse) {
      pulseAnimation?.add(firstPulse)
        .to({}, { duration: interval - duration })
        .call(() => {
          const nextPulse = createPulse();
          if (nextPulse) {
            pulseAnimation?.add(nextPulse).to({}, { duration: interval - duration });
          }
        })
        .repeat(-1);
    }
  };
  
  startPulseSequence();
};

let updatePathTimer: number | null = null;
const updatePath = () => {
  if (updatePathTimer) {
    clearTimeout(updatePathTimer);
  }
  
  updatePathTimer = setTimeout(() => {
    if (props.containerRef && props.fromRef && props.toRef) {
      const containerRect = props.containerRef.getBoundingClientRect();
      const rectA = props.fromRef.getBoundingClientRect();
      const rectB = props.toRef.getBoundingClientRect();

      const svgWidth = containerRect.width;
      const svgHeight = containerRect.height;
      svgDimensions.value = { width: svgWidth, height: svgHeight };

      const startX = rectA.left - containerRect.left + rectA.width / 2 + props.startXOffset;
      const startY = rectA.top - containerRect.top + rectA.height / 2 + props.startYOffset;
      const endX = rectB.left - containerRect.left + rectB.width / 2 + props.endXOffset;
      const endY = rectB.top - containerRect.top + rectB.height / 2 + props.endYOffset;

      let d: string;
      
      if (props.enableRightAngle) {
        const turnPos = Math.max(0, Math.min(1, props.turnPosition || 0.5));
        const radius = Math.max(0, props.cornerRadius || 0);
        
        if (props.turnDirection === 'horizontal-first') {
          const turnX = startX + (endX - startX) * turnPos;
          const turnY = startY;
          
          if (radius > 0) {
            const isGoingRight = endX > startX;
            const isGoingDown = endY > startY;
            
            const radiusX = Math.min(radius, Math.abs(turnX - startX));
            const radiusY = Math.min(radius, Math.abs(endY - turnY));
            const actualRadius = Math.min(radiusX, radiusY);
            
            if (actualRadius > 0) {
              const hEndX = turnX - (isGoingRight ? actualRadius : -actualRadius);
              const vStartY = turnY + (isGoingDown ? actualRadius : -actualRadius);
              
              const sweepFlag = (isGoingRight === isGoingDown) ? 1 : 0;
              
              d = `M ${startX},${startY} L ${hEndX},${turnY} A ${actualRadius},${actualRadius} 0 0,${sweepFlag} ${turnX},${vStartY} L ${endX},${endY}`;
            } else {
              d = `M ${startX},${startY} L ${turnX},${turnY} L ${endX},${endY}`;
            }
          } else {
            d = `M ${startX},${startY} L ${turnX},${turnY} L ${endX},${endY}`;
          }
        } else {
          const turnX = startX;
          const turnY = startY + (endY - startY) * turnPos;
          
          if (radius > 0) {
            const isGoingDown = endY > startY;
            const isGoingRight = endX > startX;
            
            const radiusY = Math.min(radius, Math.abs(turnY - startY));
            const radiusX = Math.min(radius, Math.abs(endX - turnX));
            const actualRadius = Math.min(radiusY, radiusX);
            
            if (actualRadius > 0) {
              const vEndY = turnY - (isGoingDown ? actualRadius : -actualRadius);
              const hStartX = turnX + (isGoingRight ? actualRadius : -actualRadius);
              
              const sweepFlag = (isGoingDown !== isGoingRight) ? 1 : 0;
              
              d = `M ${startX},${startY} L ${turnX},${vEndY} A ${actualRadius},${actualRadius} 0 0,${sweepFlag} ${hStartX},${turnY} L ${endX},${endY}`;
            } else {
              d = `M ${startX},${startY} L ${turnX},${turnY} L ${endX},${endY}`;
            }
          } else {
            d = `M ${startX},${startY} L ${turnX},${turnY} L ${endX},${endY}`;
          }
        }
      } else {
        if (props.curvature === 0) {
          d = `M ${startX},${startY} L ${endX},${endY}`;
        } else {
          const controlY = startY - props.curvature;
          d = `M ${startX},${startY} Q ${(startX + endX) / 2},${controlY} ${endX},${endY}`;
        }
      }
      
      pathD.value = d;
      
      pathCache.clear();
    }
  }, 16);
};

const gradientCoords = computed(() => {
  if (!props.containerRef || !props.fromRef || !props.toRef) {
    return { x1: '0%', y1: '0%', x2: '100%', y2: '0%' };
  }

  try {
    const containerRect = props.containerRef.getBoundingClientRect();
    const fromRect = props.fromRef.getBoundingClientRect();
    const toRect = props.toRef.getBoundingClientRect();

    const startX = fromRect.left - containerRect.left + fromRect.width / 2 + props.startXOffset;
    const startY = fromRect.top - containerRect.top + fromRect.height / 2 + props.startYOffset;
    const endX = toRect.left - containerRect.left + toRect.width / 2 + props.endXOffset;
    const endY = toRect.top - containerRect.top + toRect.height / 2 + props.endYOffset;

    const [x1, y1, x2, y2] = props.reverse 
      ? [endX, endY, startX, startY]
      : [startX, startY, endX, endY];

    return {
      x1: `${x1}px`,
      y1: `${y1}px`, 
      x2: `${x2}px`,
      y2: `${y2}px`
    };
  } catch (error) {
    console.warn('Error calculating gradient coordinates:', error);
    return { x1: '0%', y1: '0%', x2: '100%', y2: '0%' };
  }
});

const startGradientAnimation = () => {
  if (mainGradientAnimation) {mainGradientAnimation.kill();}
  if (innerGradientAnimation) {innerGradientAnimation.kill();}

  const beamLengthPercent = props.beamLength * 100;
  const coreLengthPercent = beamCoreLength.value * 100;
  
  let startPos: number, endPos: number, innerStartPos: number, innerEndPos: number;
  
  if (props.reverse) {
    startPos = 100 + beamLengthPercent;
    endPos = -beamLengthPercent;
    innerStartPos = 100 + coreLengthPercent;
    innerEndPos = -coreLengthPercent;
  } else {
    startPos = -beamLengthPercent;
    endPos = 100 + beamLengthPercent;
    innerStartPos = -coreLengthPercent;
    innerEndPos = 100 + coreLengthPercent;
  }
  
  beamHeadOffset.value = startPos;
  beamHeadOffsetInner.value = innerStartPos;
  
  const getEaseFunction = () => {
    switch (props.animationMode) {
      case 'ease': return 'power2.inOut';
      case 'bounce': return 'bounce.out';
      case 'wave': return 'sine.inOut';
      case 'spiral': return 'expo.inOut';
      default: return 'none';
    }
  };
  
  mainGradientAnimation = gsap.to(beamHeadOffset, {
    value: endPos,
    duration: props.duration,
    delay: props.delay,
    ease: getEaseFunction(),
    repeat: -1,
    repeatDelay: 0,
    onUpdate: updateParticlesThrottled,
  });
  
  if (props.enableInnerBeam) {
    innerGradientAnimation = gsap.to(beamHeadOffsetInner, {
      value: innerEndPos,
      duration: props.duration * (props.beamSpeedRatio || 0.7),
      delay: props.delay + props.duration * 0.1,
      ease: getEaseFunction(),
      repeat: -1,
      repeatDelay: 0,
    });
  }
  
  if (props.enableParticles) {
    initParticles();
    startParticleAnimation();
  }
  
  if (props.enablePulse) {
    startPulseAnimation();
  }
};

const stopAnimation = () => {
  if (mainGradientAnimation) {
    mainGradientAnimation.kill();
    mainGradientAnimation = null;
  }
  if (innerGradientAnimation) {
    innerGradientAnimation.kill();
    innerGradientAnimation = null;
  }
  if (particleAnimation) {
    particleAnimation.kill();
    particleAnimation = null;
  }
  if (pulseAnimation) {
    pulseAnimation.kill();
    pulseAnimation = null;
  }
};

const initResizeObserver = () => {
  if (resizeObserver) {
    resizeObserver.disconnect();
  }

  resizeObserver = new ResizeObserver(() => {
    updatePath();
  });

  if (props.containerRef) {
    resizeObserver.observe(props.containerRef);
  }
};

watch(
  [
    () => props.containerRef,
    () => props.fromRef,
    () => props.toRef,
    () => props.curvature,
    () => props.startXOffset,
    () => props.startYOffset,
    () => props.endXOffset,
    () => props.endYOffset,
    () => props.enableRightAngle,
    () => props.turnPosition,
    () => props.turnDirection,
    () => props.cornerRadius
  ],
  () => {
    nextTick(() => {
      updatePath();
      initResizeObserver();
    });
  },
  { immediate: true }
);

watch(
  [
    () => props.duration, 
    () => props.delay, 
    () => props.reverse,
    () => props.beamLength,
    () => props.beamCoreSize,
    () => props.beamIntensity,
    () => props.beamSpeedRatio,
    () => props.enableInnerBeam,
    () => props.animationMode,
    () => props.enableParticles,
    () => props.enablePulse,
    () => props.particleCount,
    () => props.pulseInterval,
    () => props.pulseDuration,
    () => props.pulseSize,
    () => props.pulseOpacity,
    () => props.enableRightAngle,
    () => props.turnDirection,
    () => props.startXOffset,
    () => props.startYOffset,
    () => props.endXOffset,
    () => props.endYOffset
  ],
  () => {
    nextTick(() => {
      stopAnimation();
      startGradientAnimation();
    });
  },
  { immediate: true }
);

onMounted(() => {
  nextTick(() => {
    updatePath();
    initResizeObserver();
    startGradientAnimation();
  });
});

onUnmounted(() => {
  stopAnimation();
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
});
</script>

<style scoped lang="scss">
.animated-beam {
  pointer-events: none;
  position: absolute;
  left: 0;
  top: 0;
  transform: translateZ(0);
  stroke-width: 2;
  overflow: visible;
  
  .glow-layer {
    filter: blur(2px);
    opacity: 0.6;
  }
  
  .main-beam {
    pointer-events: auto;
    cursor: pointer;
    transition: opacity 0.3s ease;
    
    &:hover {
      opacity: 1.2;
    }
  }
  
  .inner-beam {
    filter: brightness(1.5);
  }
  
  .particle {
    transform-origin: center;
    transition: opacity 0.2s ease;
    
    &:hover {
      transform: scale(1.2);
    }
  }
  
  .pulse-group {
    pointer-events: none;
    
    .pulse-ring-outer {
      animation: pulse-ring-expand 2s ease-out infinite;
    }
    
    .pulse-ring-middle {
      animation: pulse-ring-expand 2s ease-out infinite 0.1s;
    }
    
    .pulse-core {
      animation: pulse-core-glow 2s ease-in-out infinite;
    }
    
    .pulse-crosshair {
      stroke-linecap: round;
      opacity: 0.7;
      animation: pulse-crosshair-flash 2s ease-in-out infinite;
    }
  }
  
  .pulse-effect {
    pointer-events: none;
    filter: blur(1px);
    animation: pulse-ring 2s ease-out infinite;
  }
}

@keyframes pulse-ring {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  80% {
    transform: scale(1.2);
    opacity: 0.3;
  }
  100% {
    transform: scale(1.4);
    opacity: 0;
  }
}

.animated-beam {
  &.mode-wave {
    .main-beam {
      filter: hue-rotate(0deg) brightness(1.1);
      animation: wave-color 3s ease-in-out infinite;
    }
  }
  
  &.mode-bounce {
    .main-beam {
      filter: saturate(1.3);
    }
  }
  
  &.mode-spiral {
    .main-beam {
      filter: contrast(1.2) brightness(1.1);
    }
  }
}

@keyframes wave-color {
  0%, 100% {
    filter: hue-rotate(0deg) brightness(1.1);
  }
  50% {
    filter: hue-rotate(30deg) brightness(1.3);
  }
}

@media (max-width: 768px) {
  .animated-beam {
    .glow-layer {
      filter: blur(1px);
    }
    
    .particle {
      transform: scale(0.8);
    }
    
    .pulse-effect {
      filter: blur(0.5px);
    }
  }
}

@media (prefers-color-scheme: dark) {
  .animated-beam {
    .main-beam {
      filter: brightness(1.3);
    }
    
    .glow-layer {
      opacity: 0.8;
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .animated-beam {
    .particle {
      transition: none;
    }
    
    .pulse-effect {
      animation: none;
    }
    
    .main-beam {
      transition: none;
    }
  }
}
</style>
