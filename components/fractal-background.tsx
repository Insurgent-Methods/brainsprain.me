"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"

export function FractalBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [showDebug, setShowDebug] = useState(false)
  const [currentMuting, setCurrentMuting] = useState(0.35)

  useEffect(() => {
    let scene: THREE.Scene
    let camera: THREE.OrthographicCamera
    let renderer: THREE.WebGLRenderer
    let animationId: number
    let material: THREE.ShaderMaterial

    const init = () => {
      if (!containerRef.current) return

      try {
        scene = new THREE.Scene()
        camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)
        camera.position.z = 1

        renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: true,
          preserveDrawingBuffer: true,
        })

        const width = window.innerWidth
        const height = window.innerHeight
        renderer.setSize(width, height)
        renderer.setClearColor(0x000000, 0)

        // Set canvas styles explicitly
        const canvas = renderer.domElement
        canvas.style.position = "fixed"
        canvas.style.top = "0"
        canvas.style.left = "0"
        canvas.style.width = "100vw"
        canvas.style.height = "100vh"
        canvas.style.zIndex = "1"
        canvas.style.pointerEvents = "none"
        canvas.style.mixBlendMode = "soft-light"

        containerRef.current.appendChild(canvas)

        const vertexShader = `
          varying vec2 vUv;
          uniform float u_time;
          uniform vec2 u_cameraOffset;
          
          void main() {
            vUv = uv + u_cameraOffset;
            gl_Position = vec4(position, 1.0);
          }
        `

        const fragmentShader = `
          precision highp float;
          uniform float u_time;
          uniform vec2 u_resolution;
          uniform vec2 u_cameraOffset;
          uniform float u_mutingValue;
          varying vec2 vUv;

          // Very muted color palette - but slightly more visible
          vec3 white_base = vec3(0.97, 0.97, 0.97);           // Slightly less pure white
          vec3 cool_white = vec3(0.94, 0.95, 0.97);          // More noticeable cool white
          vec3 warm_white = vec3(0.97, 0.95, 0.93);          // More noticeable warm white
          vec3 pale_blue = vec3(0.91, 0.94, 0.97);           // More visible pale blue
          vec3 pale_teal = vec3(0.92, 0.95, 0.95);           // More visible pale teal
          vec3 pale_pink = vec3(0.97, 0.92, 0.94);           // More visible pale pink
          vec3 soft_gray = vec3(0.88, 0.90, 0.92);           // More noticeable soft gray

          // Ultra-gentle wave function
          float gentleWave(vec2 p, vec2 center, float frequency, float phase) {
            float dist = length(p - center);
            // Single gentle wave
            float wave = sin(dist * frequency - u_time * 0.3 + phase);
            
            // Very soft decay
            float envelope = exp(-dist * 0.15);
            return wave * envelope;
          }

          // Subtle interference pattern
          float subtleInterference(vec2 p) {
            float result = 0.0;
            
            // Fewer wave sources for gentler patterns
            vec2 sources[12];
            sources[0] = vec2(0.2, 0.3);    sources[1] = vec2(0.8, 0.7);
            sources[2] = vec2(0.1, 0.8);    sources[3] = vec2(0.9, 0.2);
            sources[4] = vec2(0.4, 0.1);    sources[5] = vec2(0.6, 0.9);
            sources[6] = vec2(0.7, 0.4);    sources[7] = vec2(0.3, 0.6);
            sources[8] = vec2(0.15, 0.45);  sources[9] = vec2(0.85, 0.55);
            sources[10] = vec2(0.45, 0.85); sources[11] = vec2(0.55, 0.15);
            
            // Very slow animation
            for(int i = 0; i < 12; i++) {
              vec2 animatedSource = sources[i];
              animatedSource.x += 0.008 * sin(u_time * 0.05 + float(i) * 0.2);
              animatedSource.y += 0.008 * cos(u_time * 0.04 + float(i) * 0.25);
              
              // Lower frequencies for gentler patterns
              float freq = 15.0 + float(i) * 1.0;
              float phase = float(i) * 0.4;
              result += gentleWave(p, animatedSource, freq, phase);
            }
            
            return result;
          }

          // Very gentle ripples
          float gentleRipples(vec2 p, vec2 center, float time_offset) {
            float dist = length(p - center);
            float ripple = 0.0;
            
            // Fewer, gentler ripples
            for(int i = 1; i <= 4; i++) {
              float freq = float(i) * 6.0;
              float amplitude = 1.0 / float(i);
              ripple += amplitude * sin(dist * freq - u_time * 0.4 + time_offset);
            }
            
            // Very soft envelope
            float envelope = exp(-dist * 0.8);
            return ripple * envelope;
          }

          // Subtle background texture
          float backgroundTexture(vec2 p) {
            vec2 flow = p;
            flow.x += 0.02 * sin(p.y * 8.0 + u_time * 0.02);
            flow.y += 0.02 * cos(p.x * 6.0 + u_time * 0.015);
            
            float pattern = 0.0;
            pattern += sin(flow.x * 12.0 + u_time * 0.01);
            pattern += sin(flow.y * 10.0 + u_time * 0.008);
            pattern += sin((flow.x + flow.y) * 8.0 + u_time * 0.012);
            
            return pattern * 0.1;
          }

          void main() {
            vec2 uv = vUv;
            uv.x *= u_resolution.x / u_resolution.y;
            
            // Get very subtle interference pattern
            float interference = subtleInterference(uv);
            
            // Add gentle ripples at fewer points
            float ripples = 0.0;
            ripples += gentleRipples(uv, vec2(0.25, 0.35), 0.0);
            ripples += gentleRipples(uv, vec2(0.75, 0.65), 3.0);
            ripples += gentleRipples(uv, vec2(0.45, 0.75), 6.0);
            
            // Very subtle background texture
            float background = backgroundTexture(uv);
            
            // Combine all patterns very gently
            float combined = interference * 0.3 + ripples * 0.2 + background;
            
            // Create more visible intensity mapping
            float intensity = abs(combined) * 0.8;
            
            // Very gentle color transitions - mostly white
            vec3 color = white_base;
            
            if(intensity < 0.2) {
              // Barely visible cool tint
              color = mix(white_base, cool_white, intensity * 2.0);
            } else if(intensity < 0.4) {
              // Subtle warm/cool variation
              color = mix(cool_white, pale_blue, (intensity - 0.2) * 2.5);
            } else if(intensity < 0.6) {
              // Very gentle teal tint
              color = mix(pale_blue, pale_teal, (intensity - 0.4) * 2.5);
            } else if(intensity < 0.8) {
              // Barely visible pink tint
              color = mix(pale_teal, pale_pink, (intensity - 0.6) * 2.5);
            } else {
              // Soft gray for the most intense areas (creating subtle lines)
              color = mix(pale_pink, soft_gray, (intensity - 0.8) * 2.5);
            }
            
            // Ultra-subtle animation
            color *= (0.98 + 0.02 * sin(u_time * 0.01 + combined));
            
            // Use the animated muting value
            color = mix(white_base, color, u_mutingValue);
            
            gl_FragColor = vec4(color, 1.0);
          }
        `

        material = new THREE.ShaderMaterial({
          uniforms: {
            u_time: { value: 0 },
            u_resolution: { value: new THREE.Vector2(width, height) },
            u_cameraOffset: { value: new THREE.Vector2(0, 0) },
            u_mutingValue: { value: 0.35 },
          },
          vertexShader,
          fragmentShader,
          transparent: true,
        })

        const geometry = new THREE.PlaneGeometry(2, 2)
        const mesh = new THREE.Mesh(geometry, material)
        scene.add(mesh)

        // Very slow animation loop with gentle camera movement and animated muting
        const animate = (time: number) => {
          if (!material || !renderer || !scene || !camera) return

          const t = time * 0.001

          // Gentle camera drift
          const cameraX = 0.02 * Math.sin(t * 0.03)
          const cameraY = 0.015 * Math.cos(t * 0.025)

          // Animated muting value - very slow random-like variation
          // Using multiple sine waves with different frequencies for organic randomness
          const mutingBase = 0.55 // Center point between 0.25 and 0.85
          const mutingRange = 0.3 // ±0.3 gives us 0.25 to 0.85 range

          const mutingVariation =
            0.4 * Math.sin(t * 0.007) + // Very slow primary wave
            0.3 * Math.sin(t * 0.013 + 1.2) + // Secondary wave with phase offset
            0.2 * Math.sin(t * 0.019 + 2.4) + // Tertiary wave
            0.1 * Math.sin(t * 0.031 + 3.6) // High frequency detail

          const animatedMuting = mutingBase + mutingVariation * mutingRange

          // Clamp to our desired range
          const clampedMuting = Math.max(0.25, Math.min(0.85, animatedMuting))

          // Update debug display
          setCurrentMuting(clampedMuting)

          material.uniforms.u_time.value = t
          material.uniforms.u_cameraOffset.value.set(cameraX, cameraY)
          material.uniforms.u_mutingValue.value = clampedMuting

          renderer.render(scene, camera)
          animationId = requestAnimationFrame(animate)
        }

        animationId = requestAnimationFrame(animate)

        const onResize = () => {
          const newWidth = window.innerWidth
          const newHeight = window.innerHeight
          renderer.setSize(newWidth, newHeight)
          material.uniforms.u_resolution.value.set(newWidth, newHeight)
        }
        window.addEventListener("resize", onResize)

        return () => {
          if (animationId) cancelAnimationFrame(animationId)
          window.removeEventListener("resize", onResize)
          if (renderer) renderer.dispose()
          if (scene) scene.clear()
          if (containerRef.current && renderer.domElement) {
            containerRef.current.removeChild(renderer.domElement)
          }
        }
      } catch (error) {
        console.error("WebGL fractal failed:", error)
        return () => {}
      }
    }

    const cleanup = init()
    return cleanup
  }, [])

  return (
    <>
      <div ref={containerRef} className="fixed inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }} />

      {/* Debug Panel - Optional */}
      {showDebug && (
        <div className="fixed top-4 right-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg border z-50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-800">Fractal Debug</h3>
            <button onClick={() => setShowDebug(false)} className="text-gray-500 hover:text-gray-700 text-xs">
              ✕
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Current Muting: {currentMuting.toFixed(3)}</label>
              <div className="w-full h-2 bg-gray-200 rounded-lg relative">
                <div
                  className="h-full bg-blue-500 rounded-lg transition-all duration-100"
                  style={{ width: `${((currentMuting - 0.25) / 0.6) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0.25</span>
                <span>0.85</span>
              </div>
            </div>

            <div className="text-xs text-gray-600">
              <p>Range: 25% - 85% visible</p>
              <p>Animation: Very slow organic variation</p>
            </div>
          </div>
        </div>
      )}

      {/* Show debug toggle when hidden */}
      {!showDebug && (
        <button
          onClick={() => setShowDebug(true)}
          className="fixed top-4 right-4 bg-white/80 hover:bg-white/90 p-2 rounded-lg shadow-lg border z-50 text-xs text-gray-600"
        >
          🎛️
        </button>
      )}
    </>
  )
}
