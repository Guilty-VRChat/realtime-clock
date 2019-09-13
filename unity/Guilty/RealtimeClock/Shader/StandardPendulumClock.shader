// Copyright (c) 2019 Guilty
// MIT License
// GitHub : https://github.com/Guilty-VRChat/realtime-clock
// Twitter : guilty_vrchat
// Gmail : guilty0546@gmail.com

Shader "Guilty/StandardRealtimeClock" {
    Properties {
        _Texture ("Albedo (RGB)", 2D) = "black" {}
		_ClockColor("Clock Color", Color) = (1, 1, 1, 1)
		_ClockHandsColor("Clock Hands Color", Color) = (1, 1, 1, 1)
        _Glossiness ("Smoothness", Range(0, 1)) = 0.0
        _Metallic ("Metallic", Range(0, 1)) = 1.0
		_MaxDegree ("Max Degree", Range(0, 360)) = 30.0
		_TailSpeed ("Tail Speed", Range(-20, 20)) = 5.0
		_MainTex ("Sync Texture", 2D) = "white" {}
    }
    SubShader {
        Tags {
            "RenderType" = "Opaque"
        }

        Pass {
            Name "FORWARD"
            Tags {
                "LightMode" = "ForwardBase"
            }
            CGPROGRAM
            // compile directives
            #pragma vertex vert_surf
            #pragma fragment frag_surf
            #pragma target 3.0
            #pragma multi_compile_fwdbase

            #include "HLSLSupport.cginc"
            #include "UnityShaderVariables.cginc"
            #include "UnityShaderUtilities.cginc"
            #include "UnityCG.cginc"
            #include "Lighting.cginc"
            #include "UnityPBSLighting.cginc"
            #include "AutoLight.cginc"

            #include "cginc/CustomAutoLight.cginc"

			sampler2D _Texture;
			float4 _Texture_ST;
			fixed4 _ClockColor;
			fixed4 _ClockHandsColor;
            half _Glossiness;
            half _Metallic;
			float _MaxDegree;
			float _TailSpeed;
			sampler2D _MainTex;
			float4 _MainTex_ST;

			struct Input {
				float2 uv_Texture;
			};

            struct v2f_surf {
                UNITY_POSITION(pos);
                float2 pack0 : TEXCOORD0; // _Texture
                float3 worldNormal : TEXCOORD1;
                float3 worldPos : TEXCOORD2;
                UNITY_SHADOW_COORDS(5)
            };

            int getHour(float3 textureFloats) {
				return round(((textureFloats.x + textureFloats.y + textureFloats.z) / 3) * 24);	// 0.xxxxxx * 24
			}

			int getMinSec(float3 textureFloats) {
				return round(((textureFloats.x + textureFloats.y + textureFloats.z) / 3) * 60);	// 0.xxxxxx * 60
			}

            // vertex shader
            v2f_surf vert_surf(appdata_full v) {
                float3 first = pow(tex2Dlod(_MainTex, float4(0.25, 0.75, 0, 0)).rgb, 1/2.2);
				float3 second = pow(tex2Dlod(_MainTex, float4(0.75, 0.75, 0, 0)).rgb, 1/2.2);
				float3 third = pow(tex2Dlod(_MainTex, float4(0.25, 0.25, 0, 0)).rgb, 1/2.2);

				float3 offsetTime = float3(getHour(float3(first.r, second.g, third.b)), getMinSec(float3(first.g, second.b, third.r)), getMinSec(float3(first.b, second.r, third.g)));

				float time = (tex2Dlod(_MainTex, float4(0.75,0.25,0,0)).r < 0.5) ? (((offsetTime.r * 60 * 60) + (offsetTime.g * 60) + (offsetTime.b)) + _Time.y) : 0;

				v.vertex.xy = float2(v.vertex.xy.x * cos(time / 60 * 2 * UNITY_PI * step(0.005, v.vertex.z)) - v.vertex.xy.y * sin(time / 60 * 2 * UNITY_PI * step(0.005, v.vertex.z)), v.vertex.xy.y * cos(time / 60 * 2 * UNITY_PI * step(0.005, v.vertex.z)) + v.vertex.xy.x * sin(time / 60 * 2 * UNITY_PI * step(0.005, v.vertex.z)));
				v.vertex.xy = float2(v.vertex.xy.x * cos(time / 60 / 60 * 2 * UNITY_PI * step(-0.005, v.vertex.z) * step(v.vertex.z, 0.005)) - v.vertex.xy.y * sin(time / 60 / 60 * 2 * UNITY_PI * step(-0.005, v.vertex.z) * step(v.vertex.z, 0.005)), v.vertex.xy.y * cos(time / 60 / 60 * 2 * UNITY_PI * step(-0.005, v.vertex.z) * step(v.vertex.z, 0.005)) + v.vertex.xy.x * sin(time / 60 / 60 * 2 * UNITY_PI * step(-0.005, v.vertex.z) * step(v.vertex.z, 0.005)));
				v.vertex.xy = float2(v.vertex.xy.x * cos(time / 60 / 60 / 12 * 2 * UNITY_PI * step(-0.015, v.vertex.z) * step(v.vertex.z, -0.005)) - v.vertex.xy.y * sin(time / 60 / 60 / 12 * 2 * UNITY_PI * step(-0.015, v.vertex.z) * step(v.vertex.z, -0.005)), v.vertex.xy.y * cos(time / 60 / 60 / 12 * 2 * UNITY_PI * step(-0.015, v.vertex.z) * step(v.vertex.z, -0.005)) + v.vertex.xy.x * sin(time / 60 / 60 / 12 * 2 * UNITY_PI * step(-0.015, v.vertex.z) * step(v.vertex.z, -0.005)));
				
                v2f_surf o;
                UNITY_INITIALIZE_OUTPUT(v2f_surf, o);
                o.pos = UnityObjectToClipPos(v.vertex);
                o.pack0.xy = TRANSFORM_TEX(v.texcoord, _Texture);
                o.worldPos.xyz = mul(unity_ObjectToWorld, v.vertex).xyz;
                o.worldNormal = UnityObjectToWorldNormal(v.normal);
                UNITY_TRANSFER_LIGHTING(o, v.texcoord1.xy); // pass shadow and, possibly, light cookie coordinates to pixel shader
                return o;
            }

			//surface shader
			void surf(Input IN, inout SurfaceOutputStandard o) {
				// Albedo comes from a texture tinted by color
                fixed4 col = tex2D(_Texture, IN.uv_Texture);
				col = fixed4(saturate((_ClockHandsColor.r * col.r) + (_ClockColor.r) * (1.0 - col.r)),
							 saturate((_ClockHandsColor.g * col.g) + (_ClockColor.g) * (1.0 - col.g)),
							 saturate((_ClockHandsColor.b * col.b) + (_ClockColor.b) * (1.0 - col.b)),
							 saturate((_ClockHandsColor.a * col.a) + (_ClockColor.a) * (1.0 - col.a)));
				o.Albedo = col.rgb;
				// Metallic and smoothness come from slider variables
				o.Metallic = _Metallic;
				o.Smoothness = _Glossiness;
				o.Alpha = col.a;
			}

            // fragment shader
            fixed4 frag_surf(v2f_surf IN) : SV_Target {
                //surf
                SurfaceOutputStandard o;
                UNITY_INITIALIZE_OUTPUT(SurfaceOutputStandard, o);
				Input input;
				input.uv_Texture = IN.pack0;
                o.Emission = 0.0;
                o.Occlusion = 1.0;
                o.Normal = IN.worldNormal;

				surf(input, o);

                float3 worldPos = IN.worldPos;
                #ifndef USING_DIRECTIONAL_LIGHT
                    fixed3 lightDir = normalize(UnityWorldSpaceLightDir(worldPos));
                #else
                    fixed3 lightDir = _WorldSpaceLightPos0.xyz;
                #endif
                float3 worldViewDir = normalize(UnityWorldSpaceViewDir(worldPos));

                UNITY_LIGHT_ATTENUATION(atten, IN, worldPos)
                fixed4 c = 0;

                UnityGI gi;
                UNITY_INITIALIZE_OUTPUT(UnityGI, gi);
                gi.light.color = _LightColor0.rgb;
                gi.light.dir = lightDir;

                UnityGIInput giInput;
                UNITY_INITIALIZE_OUTPUT(UnityGIInput, giInput);
                giInput.light = gi.light;
                giInput.worldPos = worldPos;
                giInput.worldViewDir = worldViewDir;
                giInput.atten = atten;

                giInput.probeHDR[0] = unity_SpecCube0_HDR;
                giInput.probeHDR[1] = unity_SpecCube1_HDR;
                #if defined(UNITY_SPECCUBE_BLENDING) || defined(UNITY_SPECCUBE_BOX_PROJECTION)
                    giInput.boxMin[0] = unity_SpecCube0_BoxMin; // .w holds lerp value for blending
                #endif
                LightingStandard_GI(o, giInput, gi);
                c += LightingStandard (o, worldViewDir, gi);
                return c;
            }

            ENDCG
        }
    }
    
    FallBack "Diffuse"
}
