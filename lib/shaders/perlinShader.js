THREE.PerlinShader = {

uniforms: {
                      "tDiffuse":   { type: "t", value: null },
                      "time": { type: "f", value: 1.0 },
                      "color_schemaR": { type: "f", value: 0. },
                      "color_schemaG": { type: "f", value: 0. },
                      "color_schemaB": { type: "f", value: 0. },
                      "resolution": { type: "v2", value: new THREE.Vector2() },
                      "u_mouse": { type: "v2", value: new THREE.Vector2() }
                  },

                      vertexShader:[
                        "varying vec2 vUv;",
                            "void main() {",
                                "vUv = uv;",
                                "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
                            "}"
                        ].join("\n"),

                        fragmentShader: [
                          "precision mediump float;",
                          "varying vec2 vUv;",
                          "uniform float time;",
                          "uniform float color_schemaR;",
                          "uniform float color_schemaG;",
                          "uniform float color_schemaB;",
                          "uniform vec2 resolution;",
                          "uniform vec2 u_mouse;",
                          "uniform sampler2D tDiffuse;",


                          // makes a pseudorandom number between 0 and 1
                          "float hash(float n) {",
                          "return fract(sin(n)*93942.234);",
                          "}",

                          // smoothsteps a grid of random numbers at the integers
                          "float noise(vec2 p) {",
                          "vec2 w = floor(p);",
                          "vec2 k = fract(p);",
                          "k = k*k*(3.-2.*k);", // smooth it

                          "float n = w.x + w.y*57.;",

                          "float a = hash(n);",
                          "float b = hash(n+1.);",
                          "float c = hash(n+57.);",
                          "float d = hash(n+58.);",

                          "return mix(",
                          "mix(a, b, k.x),",
                          "mix(c, d, k.x),",
                          "k.y);",
                          "}",

                          // rotation matrix
                          "mat2 m = mat2(0.6,0.8,-0.8,0.6);",

                          // fractional brownian motion (i.e. photoshop clouds)
                          "float fbm(vec2 p) {",
                          "float f = 0.;",
                          "f += 0.8000*noise(p); p *= 2.02*m;",
                          "f += 0.1500*noise(p); p *= 2.01*m;",
                          "f += 0.1650*noise(p); p *= 2.03*m;",
                          "f += 0.025*noise(p);",
                          "f /= 0.9975;",
                          "return f;",
                          "}",

                          "void main() {",
                          // relative coordinates
                          "vec2 position = vUv;",
                          "vec2 pTrack = position;",
                          "vec4 color = texture2D(tDiffuse, pTrack + 0.);",
                          "pTrack.y+=color.r * 0.7;",
                          "vec2 p = vec2(pTrack*6. + (u_mouse.x / 1000.))*vec2(resolution.x/resolution.y, 1.);",
                          "float t = time * .009;",

                          // calling fbm on itself
                          "vec2 a = vec2(fbm(p+t*20. * u_mouse.y/2000.), fbm(p-t*30.+8.1));",
                          "vec2 b = vec2(fbm(p+t*4. + a*7. + 10.1 + (sin(u_mouse.x) / 100.)), fbm(p-t*4. + a*7. + 91.1));",
                          "float c = fbm(b*9. + t*20.);",

                          // increase contrast
                          "c = smoothstep(0.15,0.98,c);",

                          // mix in some color
                          "vec3 col = vec3(c);",

                          "col.r += b.x*color_schemaR;",
                          "col.b += b.x*color_schemaB;",
                          "col.g += b.y*color_schemaG;",

                          "gl_FragColor = vec4(col, 1.);",

                        "}"
                    ].join("\n")

                };
