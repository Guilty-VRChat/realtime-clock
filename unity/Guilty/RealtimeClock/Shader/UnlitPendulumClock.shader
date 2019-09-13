// Copyright (c) 2019 Guilty
// MIT License
// GitHub : https://github.com/Guilty-VRChat/realtime-clock
// Twitter : guilty_vrchat
// Gmail : guilty0546@gmail.com

Shader "Guilty/UnlitRealtimeClock" {
	Properties {
		_Texture ("Texture", 2D) = "black" {}
		_ClockColor("Clock Color", Color) = (1, 1, 1, 1)
		_ClockHandsColor("Clock Hands Color", Color) = (1, 1, 1, 1)
		_MainTex ("Sync Texture", 2D) = "white" {}
	}
	SubShader {
		Tags {
			"IgnoreProjector" = "True"
			"Queue" = "Transparent"
			"RenderType" = "Transparent"
		}
		LOD 200

		Blend SrcAlpha OneMinusSrcAlpha
		Cull Back
		ZWrite On

		Pass {
			CGPROGRAM
			#pragma vertex vert
			#pragma fragment frag
			#pragma multi_compile_fog
			#pragma multi_compile APPLY_GAMMA_OFF GAMMA
			#pragma multi_compile TICKTACK_OFF TICKTACK

			#include "UnityCG.cginc"

			sampler2D _Texture;
			float4 _Texture_ST;
			fixed4 _ClockColor;
			fixed4 _ClockHandsColor;
			sampler2D _MainTex;
			float4 _MainTex_ST;

			struct appdata {
				float4 vertex: POSITION;
				float2 uv: TEXCOORD0;
				float4 color: COLOR;
				UNITY_VERTEX_INPUT_INSTANCE_ID
			};

			struct v2f {
				float4 vertex: SV_POSITION;
				float2 uv: TEXCOORD0;
				float4 color: COLOR;
				UNITY_FOG_COORDS(1)
				UNITY_VERTEX_OUTPUT_STEREO
			};
			
			int getHour(float3 textureFloats) {
				return round(((textureFloats.x + textureFloats.y + textureFloats.z) / 3) * 24);	// 0.xxxxxx * 24
			}

			int getMinSec(float3 textureFloats) {
				return round(((textureFloats.x + textureFloats.y + textureFloats.z) / 3) * 60);	// 0.xxxxxx * 60
			}

			v2f vert(appdata v) {
				float3 first = pow(tex2Dlod(_MainTex, float4(0.25, 0.75, 0, 0)).rgb, 1/2.2);
				float3 second = pow(tex2Dlod(_MainTex, float4(0.75, 0.75, 0, 0)).rgb, 1/2.2);
				float3 third = pow(tex2Dlod(_MainTex, float4(0.25, 0.25, 0, 0)).rgb, 1/2.2);

				float3 offsetTime = float3(getHour(float3(first.r, second.g, third.b)), getMinSec(float3(first.g, second.b, third.r)), getMinSec(float3(first.b, second.r, third.g)));

				float time = (tex2Dlod(_MainTex, float4(0.75,0.25,0,0)).r < 0.5) ? (((offsetTime.r * 60 * 60) + (offsetTime.g * 60) + (offsetTime.b)) + _Time.y) : 0;
				
				v.vertex.xy = float2(v.vertex.xy.x * cos(time / 60 * 2 * UNITY_PI * step(0.005, v.vertex.z)) - v.vertex.xy.y * sin(time / 60 * 2 * UNITY_PI * step(0.005, v.vertex.z)), v.vertex.xy.y * cos(time / 60 * 2 * UNITY_PI * step(0.005, v.vertex.z)) + v.vertex.xy.x * sin(time / 60 * 2 * UNITY_PI * step(0.005, v.vertex.z)));
				v.vertex.xy = float2(v.vertex.xy.x * cos(time / 60 / 60 * 2 * UNITY_PI * step(-0.005, v.vertex.z) * step(v.vertex.z, 0.005)) - v.vertex.xy.y * sin(time / 60 / 60 * 2 * UNITY_PI * step(-0.005, v.vertex.z) * step(v.vertex.z, 0.005)), v.vertex.xy.y * cos(time / 60 / 60 * 2 * UNITY_PI * step(-0.005, v.vertex.z) * step(v.vertex.z, 0.005)) + v.vertex.xy.x * sin(time / 60 / 60 * 2 * UNITY_PI * step(-0.005, v.vertex.z) * step(v.vertex.z, 0.005)));
				v.vertex.xy = float2(v.vertex.xy.x * cos(time / 60 / 60 / 12 * 2 * UNITY_PI * step(-0.015, v.vertex.z) * step(v.vertex.z, -0.005)) - v.vertex.xy.y * sin(time / 60 / 60 / 12 * 2 * UNITY_PI * step(-0.015, v.vertex.z) * step(v.vertex.z, -0.005)), v.vertex.xy.y * cos(time / 60 / 60 / 12 * 2 * UNITY_PI * step(-0.015, v.vertex.z) * step(v.vertex.z, -0.005)) + v.vertex.xy.x * sin(time / 60 / 60 / 12 * 2 * UNITY_PI * step(-0.015, v.vertex.z) * step(v.vertex.z, -0.005)));
				
				v2f o;
				UNITY_SETUP_INSTANCE_ID(v);
				UNITY_INITIALIZE_OUTPUT(v2f, o)
				UNITY_INITIALIZE_VERTEX_OUTPUT_STEREO(o);
				o.vertex = UnityObjectToClipPos(v.vertex);
				o.uv = v.uv;
				o.color = v.color;
				UNITY_TRANSFER_FOG(o,o.vertex);
				return o;
			}

			float4 frag(v2f i) : COLOR {
				fixed4 col = tex2D(_Texture, i.uv);
				col = fixed4(saturate((_ClockHandsColor.r * col.r) + (_ClockColor.r) * (1.0 - col.r)),
							 saturate((_ClockHandsColor.g * col.g) + (_ClockColor.g) * (1.0 - col.g)),
							 saturate((_ClockHandsColor.b * col.b) + (_ClockColor.b) * (1.0 - col.b)),
							 saturate((_ClockHandsColor.a * col.a) + (_ClockColor.a) * (1.0 - col.a)));
				UNITY_APPLY_FOG(i.fogCoord, col);
				return col;
			}

			ENDCG
		}
	}
}
