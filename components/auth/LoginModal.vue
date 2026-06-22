<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="open"
        class="fixed inset-0 z-[90] flex items-center justify-center p-3 sm:p-4"
        @click.self="emit('close')"
        @mousemove="onMouseMove"
      >
        <div class="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
        <div
          v-if="pointer.active"
          class="pointer-glow"
          :style="{ left: `${pointer.x}px`, top: `${pointer.y}px` }"
        ></div>

        <div
          class="relative grid w-full max-w-[900px] overflow-hidden rounded-[18px] border border-white/10 bg-[#17171b] shadow-[0_28px_100px_rgba(0,0,0,0.45)] lg:min-h-[520px] lg:grid-cols-[1.08fr_1fr]"
        >
          <section
            class="relative hidden overflow-hidden bg-[#121217] lg:block"
          >
            <div
              class="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(255,221,87,0.08),transparent_34%),radial-gradient(circle_at_65%_20%,rgba(255,140,102,0.08),transparent_28%),radial-gradient(circle_at_50%_75%,rgba(146,104,224,0.08),transparent_30%)]"
            ></div>
            <div
              class="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent_30%,rgba(255,255,255,0.02))]"
            ></div>

            <div
              class="relative flex h-full min-h-[520px] items-end justify-center p-10"
            >
              <div
                class="characters-scene"
                :class="{ 'is-hovering': hasInteracted }"
                aria-hidden="true"
              >
                <div id="char-yellow" class="character char-yellow">
                  <div
                    id="yellow-eyes"
                    class="eyes"
                    style="left: 52px; top: 40px; gap: 18px"
                  >
                    <div class="eyeball" style="width: 12px; height: 12px">
                      <div
                        id="yellow-pupil-l"
                        class="pupil"
                        style="width: 4px; height: 4px"
                      ></div>
                    </div>
                    <div class="eyeball" style="width: 12px; height: 12px">
                      <div
                        id="yellow-pupil-r"
                        class="pupil"
                        style="width: 4px; height: 4px"
                      ></div>
                    </div>
                  </div>
                </div>

                <div id="char-black" class="character char-black">
                  <div
                    id="black-eyes"
                    class="eyes"
                    style="left: 26px; top: 32px; gap: 16px"
                  >
                    <div
                      id="black-eye-l"
                      class="eyeball"
                      style="width: 11px; height: 11px"
                    >
                      <div
                        id="black-pupil-l"
                        class="pupil"
                        style="width: 4px; height: 4px"
                      ></div>
                    </div>
                    <div class="eyeball" style="width: 11px; height: 11px">
                      <div
                        id="black-pupil-r"
                        class="pupil"
                        style="width: 4px; height: 4px"
                      ></div>
                    </div>
                  </div>
                </div>

                <div id="char-orange" class="character char-orange">
                  <div
                    id="orange-eyes"
                    class="eyes"
                    style="left: 82px; top: 90px; gap: 28px"
                  >
                    <div id="orange-pupil-l" class="bare-pupil"></div>
                    <div id="orange-pupil-r" class="bare-pupil"></div>
                  </div>
                </div>

                <div id="char-purple" class="character char-purple">
                  <div
                    id="purple-eyes"
                    class="eyes"
                    style="left: 45px; top: 40px; gap: 22px"
                  >
                    <div id="purple-pupil-l" class="bare-pupil"></div>
                    <div id="purple-pupil-r" class="bare-pupil"></div>
                  </div>
                  <div
                    class="yellow-mouth"
                    style="left: 20px; top: 58px; width: 46px"
                  ></div>
                </div>
              </div>
            </div>
          </section>

          <section
            class="relative flex items-center justify-center bg-[#19191d] px-5 py-7 sm:px-8 sm:py-10"
          >
            <button
              type="button"
              class="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full text-white/70 transition hover:bg-white/5 hover:text-white"
              @click="emit('close')"
              aria-label="Close"
            >
              <span class="text-[28px] leading-none">×</span>
            </button>

            <div class="w-full max-w-[400px]">
              <div
                class="mb-8 flex items-center justify-center gap-2 text-white"
              >
                <span class="text-[18px]">🌙</span>
                <span class="text-[18px] font-semibold tracking-[-0.03em]"
                  >Nano Banana AI</span
                >
              </div>

              <button
                type="button"
                class="google-btn"
                @click="emit('google', { clientId: 'google-oauth' })"
              >
                <span class="inline-flex items-center gap-3">
                  <svg class="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A11.96 11.96 0 0 0 1 12c0 1.94.46 3.77 1.18 5.07l3.66-2.84v-.14z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span>Sign-up with Google</span>
                </span>
              </button>

              <div class="divider"><span>OR CONTINUE WITH</span></div>

              <form
                class="mt-6 grid gap-4"
                @submit.prevent="sendVerificationCode"
              >
                <label class="grid gap-2 text-[14px] font-medium text-white/90">
                  <span class="sr-only">Email</span>
                  <input
                    ref="emailInput"
                    v-model.trim="email"
                    type="email"
                    placeholder="your@email.com"
                    class="field-input"
                    autocomplete="email"
                    @focus="handleEmailFocus"
                    @blur="handleEmailBlur"
                    @input="onEmailInput"
                  />
                </label>

                <button type="submit" class="primary-btn" :disabled="!email">
                  Continue
                </button>

                <Transition name="slide-fade">
                  <div
                    v-if="step !== 'email'"
                    class="rounded-[16px] border border-white/8 bg-white/4 p-4"
                  >
                    <div class="mb-3 text-[13px] text-white/65">
                      {{
                        step === "code"
                          ? "Enter the verification code like a password."
                          : "Use the code as your password to continue."
                      }}
                    </div>
                    <div class="grid gap-3">
                      <div class="relative">
                        <input
                          ref="passwordInput"
                          v-model.trim="verificationCode"
                          :type="showPassword ? 'text' : 'password'"
                          inputmode="numeric"
                          maxlength="6"
                          placeholder="password / code"
                          class="field-input pr-12"
                          autocomplete="one-time-code"
                          @focus="handlePasswordFocus"
                          @blur="handlePasswordBlur"
                          @input="handlePasswordInput"
                        />
                        <button
                          type="button"
                          class="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] font-semibold text-white/55"
                          @click="togglePassword"
                        >
                          {{ showPassword ? "Hide" : "Show" }}
                        </button>
                      </div>
                      <button
                        type="button"
                        class="secondary-btn"
                        @click="verifyCode"
                      >
                        Verify and continue
                      </button>
                    </div>
                  </div>
                </Transition>
              </form>
            </div>
          </section>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{ open: boolean }>();
const emit = defineEmits<{
  (e: "close"): void;
  (e: "google", payload: { clientId: string }): void;
  (e: "email", payload: { email: string }): void;
}>();

const emailInput = ref<HTMLInputElement | null>(null);
const passwordInput = ref<HTMLInputElement | null>(null);

const email = ref("");
const verificationCode = ref("");
const step = ref<"email" | "code" | "verify">("email");
const showPassword = ref(false);

const mouseX = ref(0);
const mouseY = ref(0);
const pointer = reactive({ x: 0, y: 0, active: false });

const focusedField = ref<"email" | "password" | null>(null);
const hasInteracted = ref(false);

const isPurpleBlinking = ref(false);
const isBlackBlinking = ref(false);
const isPurplePeeking = ref(false);
const isLoginError = ref(false);

let typingTimer: ReturnType<typeof setTimeout> | null = null;
let errorRecoverTimer: ReturnType<typeof setTimeout> | null = null;
let blinkPurpleTimer: ReturnType<typeof setTimeout> | null = null;
let blinkBlackTimer: ReturnType<typeof setTimeout> | null = null;
let peekTimer: ReturnType<typeof setTimeout> | null = null;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const clearAllTimers = () => {
  [
    typingTimer,
    errorRecoverTimer,
    blinkPurpleTimer,
    blinkBlackTimer,
    peekTimer,
  ].forEach((timer) => timer && clearTimeout(timer));
  typingTimer =
    errorRecoverTimer =
    blinkPurpleTimer =
    blinkBlackTimer =
    peekTimer =
      null;
};

const calcPosition = (el: HTMLElement) => {
  const rect = el.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 3;
  const dx = mouseX.value - cx;
  const dy = mouseY.value - cy;
  return {
    faceX: clamp(dx / 20, -15, 15),
    faceY: clamp(dy / 30, -10, 10),
    bodySkew: clamp(-dx / 120, -6, 6),
  };
};

const calcPupilOffset = (el: HTMLElement, maxDist: number) => {
  const rect = el.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const dx = mouseX.value - cx;
  const dy = mouseY.value - cy;
  const dist = Math.min(Math.sqrt(dx * dx + dy * dy), maxDist);
  const angle = Math.atan2(dy, dx);
  return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist };
};

const updateCharacters = () => {
  if (!process.client) return;

  const purple = document.getElementById("char-purple") as HTMLElement | null;
  const black = document.getElementById("char-black") as HTMLElement | null;
  const orange = document.getElementById("char-orange") as HTMLElement | null;
  const yellow = document.getElementById("char-yellow") as HTMLElement | null;
  if (!purple || !black || !orange || !yellow) return;

  if (!hasInteracted.value && !isLoginError.value) {
    purple.style.transform = "skewX(0deg)";
    black.style.transform = "skewX(0deg)";
    orange.style.transform = "skewX(0deg)";
    yellow.style.transform = "skewX(0deg)";
    return;
  }

  const purplePos = calcPosition(purple);
  const blackPos = calcPosition(black);
  const orangePos = calcPosition(orange);
  const yellowPos = calcPosition(yellow);

  const isPasswordMode = focusedField.value === "password";
  const isEmailMode = focusedField.value === "email";
  const hasPasswordText = (passwordInput.value?.value.length || 0) > 0;
  const isShowingPwd = isPasswordMode && showPassword.value && hasPasswordText;
  const isLookingAway =
    isEmailMode && !showPassword.value && hasInteracted.value;

  purple.style.transform = isShowingPwd
    ? "skewX(0deg)"
    : isLookingAway
      ? "skewX(-14deg) translateX(-20px)"
      : isPasswordMode
        ? `skewX(${purplePos.bodySkew - 12}deg) translateX(40px)`
        : `skewX(${purplePos.bodySkew}deg)`;

  black.style.transform = isShowingPwd
    ? "skewX(0deg)"
    : isLookingAway
      ? "translateX(20px)"
      : isPasswordMode
        ? `skewX(${blackPos.bodySkew * 1.5}deg)`
        : `skewX(${blackPos.bodySkew}deg)`;

  orange.style.transform = isShowingPwd
    ? "skewX(0deg)"
    : isLookingAway
      ? "skewX(-6deg)"
      : `skewX(${orangePos.bodySkew}deg)`;
  yellow.style.transform = isShowingPwd
    ? "skewX(0deg)"
    : isLookingAway
      ? "skewX(6deg)"
      : `skewX(${yellowPos.bodySkew}deg)`;

  const blackEyes = document.getElementById("black-eyes") as HTMLElement | null;
  const blackEyeL = document.getElementById(
    "black-eye-l",
  ) as HTMLElement | null;
  const blackPupilL = document.getElementById(
    "black-pupil-l",
  ) as HTMLElement | null;
  const blackPupilR = document.getElementById(
    "black-pupil-r",
  ) as HTMLElement | null;
  if (blackEyes && blackEyeL && blackPupilL && blackPupilR) {
    const bo = calcPupilOffset(blackEyeL, 4);
    blackPupilL.style.transform = `translate(${bo.x}px, ${bo.y}px)`;
    blackPupilR.style.transform = `translate(${bo.x}px, ${bo.y}px)`;
    blackEyes.style.left = `${26 + blackPos.faceX}px`;
    blackEyes.style.top = `${32 + blackPos.faceY}px`;
  }

  const purpleEyes = document.getElementById(
    "purple-eyes",
  ) as HTMLElement | null;
  const purpleEyeL = document.getElementById(
    "purple-pupil-l",
  ) as HTMLElement | null;
  const purplePupilL = document.getElementById(
    "purple-pupil-l",
  ) as HTMLElement | null;
  const purplePupilR = document.getElementById(
    "purple-pupil-r",
  ) as HTMLElement | null;
  if (purpleEyes && purpleEyeL && purplePupilL && purplePupilR) {
    const po = calcPupilOffset(purpleEyeL, 5);
    purplePupilL.style.transform = `translate(${po.x}px, ${po.y}px)`;
    purplePupilR.style.transform = `translate(${po.x}px, ${po.y}px)`;
    purpleEyes.style.left = `${45 + purplePos.faceX}px`;
    purpleEyes.style.top = `${40 + purplePos.faceY}px`;
  }

  const orangeEyes = document.getElementById(
    "orange-eyes",
  ) as HTMLElement | null;
  const orangePupilL = document.getElementById(
    "orange-pupil-l",
  ) as HTMLElement | null;
  const orangePupilR = document.getElementById(
    "orange-pupil-r",
  ) as HTMLElement | null;
  if (orangeEyes && orangePupilL && orangePupilR) {
    const oo = calcPupilOffset(orangePupilL, 5);
    orangePupilL.style.transform = `translate(${oo.x}px, ${oo.y}px)`;
    orangePupilR.style.transform = `translate(${oo.x}px, ${oo.y}px)`;
    orangeEyes.style.left = `${82 + orangePos.faceX}px`;
    orangeEyes.style.top = `${90 + orangePos.faceY}px`;
  }

  const yellowEyes = document.getElementById(
    "yellow-eyes",
  ) as HTMLElement | null;
  const yellowPupilL = document.getElementById(
    "yellow-pupil-l",
  ) as HTMLElement | null;
  const yellowPupilR = document.getElementById(
    "yellow-pupil-r",
  ) as HTMLElement | null;
  if (yellowEyes && yellowPupilL && yellowPupilR) {
    const yo = calcPupilOffset(yellowPupilL, 5);
    yellowPupilL.style.transform = `translate(${yo.x}px, ${yo.y}px)`;
    yellowPupilR.style.transform = `translate(${yo.x}px, ${yo.y}px)`;
    yellowEyes.style.left = `${52 + yellowPos.faceX}px`;
    yellowEyes.style.top = `${40 + yellowPos.faceY}px`;
  }
};

const scheduleBlinkPurple = () => {
  clearTimeout(blinkPurpleTimer as any);
  blinkPurpleTimer = setTimeout(
    () => {
      if (!hasInteracted.value) return scheduleBlinkPurple();
      isPurpleBlinking.value = true;
      updateCharacters();
      setTimeout(() => {
        isPurpleBlinking.value = false;
        updateCharacters();
        scheduleBlinkPurple();
      }, 150);
    },
    Math.random() * 4000 + 3000,
  );
};

const scheduleBlinkBlack = () => {
  clearTimeout(blinkBlackTimer as any);
  blinkBlackTimer = setTimeout(
    () => {
      if (!hasInteracted.value) return scheduleBlinkBlack();
      isBlackBlinking.value = true;
      updateCharacters();
      setTimeout(() => {
        isBlackBlinking.value = false;
        updateCharacters();
        scheduleBlinkBlack();
      }, 150);
    },
    Math.random() * 4000 + 3000,
  );
};

const schedulePeek = () => {
  const pwdLen = passwordInput.value?.value.length || 0;
  if (pwdLen > 0 && showPassword.value) {
    clearTimeout(peekTimer as any);
    peekTimer = setTimeout(
      () => {
        if (
          (passwordInput.value?.value.length || 0) > 0 &&
          showPassword.value
        ) {
          isPurplePeeking.value = true;
          updateCharacters();
          setTimeout(() => {
            isPurplePeeking.value = false;
            updateCharacters();
            schedulePeek();
          }, 800);
        }
      },
      Math.random() * 3000 + 2000,
    );
  }
};

const startInteraction = (field: "email" | "password") => {
  hasInteracted.value = true;
  focusedField.value = field;
  updateCharacters();
};

const handleEmailFocus = () => {
  startInteraction("email");
};

const handleEmailBlur = () => {
  if (focusedField.value === "email") focusedField.value = null;
  updateCharacters();
};

const onEmailInput = () => {
  hasInteracted.value = true;
  updateCharacters();
};

const handlePasswordFocus = () => {
  startInteraction("password");
};

const handlePasswordBlur = () => {
  if (focusedField.value === "password") focusedField.value = null;
  updateCharacters();
};

const handlePasswordInput = () => {
  hasInteracted.value = true;
  if (showPassword.value) schedulePeek();
  updateCharacters();
};

const togglePassword = () => {
  showPassword.value = !showPassword.value;
  hasInteracted.value = true;
  if (focusedField.value === "password" && showPassword.value) schedulePeek();
  updateCharacters();
};

const handleLoginError = () => {
  clearTimeout(errorRecoverTimer as any);
  isLoginError.value = true;
  hasInteracted.value = true;
  updateCharacters();
  errorRecoverTimer = setTimeout(() => {
    isLoginError.value = false;
    updateCharacters();
  }, 2500);
};

const sendVerificationCode = () => {
  if (!email.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) return;
  step.value = "code";
  emit("email", { email: email.value });
};

const verifyCode = () => {
  if (verificationCode.value.length < 6) return;
  step.value = "verify";
};

const onMouseMove = (e: MouseEvent) => {
  mouseX.value = e.clientX;
  mouseY.value = e.clientY;
  pointer.x = e.clientX;
  pointer.y = e.clientY;
  pointer.active =
    hasInteracted.value || focusedField.value !== null || isLoginError.value;
  if (pointer.active) updateCharacters();
};

watch(
  () => props.open,
  (value) => {
    if (!value) {
      clearAllTimers();
      email.value = "";
      verificationCode.value = "";
      step.value = "email";
      showPassword.value = false;
      focusedField.value = null;
      hasInteracted.value = false;
      pointer.active = false;
      isPurpleBlinking.value = false;
      isBlackBlinking.value = false;
      isPurplePeeking.value = false;
      isLoginError.value = false;
      if (process.client) updateCharacters();
      return;
    }

    nextTick(() => {
      if (!process.client) return;
      updateCharacters();
      scheduleBlinkPurple();
      scheduleBlinkBlack();
    });
  },
);

onMounted(() => {
  window.addEventListener("mousemove", onMouseMove);
});

onBeforeUnmount(() => {
  window.removeEventListener("mousemove", onMouseMove);
  clearAllTimers();
});
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 220ms ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition:
    opacity 180ms ease,
    transform 180ms ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

.google-btn,
.primary-btn,
.secondary-btn,
.field-input {
  width: 100%;
  border-radius: 14px;
  transition:
    transform 180ms ease,
    border-color 180ms ease,
    background-color 180ms ease,
    opacity 180ms ease;
}

.google-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  border: 1px solid transparent;
  background:
    linear-gradient(#1c1c21, #1c1c21) padding-box,
    linear-gradient(90deg, #34a853, #fbbc05, #ea4335) border-box;
  color: #f7f7f7;
  font-size: 15px;
  font-weight: 500;
}

.primary-btn {
  min-height: 48px;
  border: 1px solid #ece8e1;
  background: #f6f4ef;
  color: #16161a;
  font-size: 15px;
  font-weight: 600;
}

.secondary-btn {
  min-height: 44px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
}

.field-input {
  min-height: 48px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  padding: 0 14px;
  color: #fff;
  outline: none;
}

.field-input::placeholder {
  color: rgba(255, 255, 255, 0.36);
}

.field-input:focus {
  border-color: rgba(255, 255, 255, 0.18);
}

.divider {
  position: relative;
  margin-top: 22px;
  text-align: center;
}

.divider::before,
.divider::after {
  content: "";
  position: absolute;
  top: 50%;
  width: calc(50% - 72px);
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
}

.divider::before {
  left: 0;
}
.divider::after {
  right: 0;
}

.divider span {
  display: inline-block;
  padding: 0 12px;
  color: rgba(255, 255, 255, 0.45);
  font-size: 12px;
  letter-spacing: 0.08em;
}

.pointer-glow {
  position: fixed;
  z-index: 0;
  width: 220px;
  height: 220px;
  border-radius: 999px;
  pointer-events: none;
  transform: translate(-50%, -50%);
  background: radial-gradient(
    circle,
    rgba(239, 77, 44, 0.16) 0%,
    rgba(239, 77, 44, 0.08) 30%,
    transparent 70%
  );
  filter: blur(14px);
}

.characters-scene {
  position: relative;
  width: 360px;
  height: 300px;
  transform-style: preserve-3d;
  transition: transform 220ms ease;
}

.character {
  position: absolute;
  bottom: 0;
  transition:
    transform 180ms ease,
    filter 180ms ease,
    height 180ms ease;
  transform-origin: bottom center;
}

.char-yellow {
  left: 42px;
  width: 120px;
  height: 210px;
  background: #fedf35;
  border-radius: 8px 8px 0 0;
  z-index: 1;
}
.char-black {
  left: 128px;
  width: 110px;
  height: 180px;
  background: #2c2b31;
  border-radius: 8px 8px 0 0;
  z-index: 2;
}
.char-orange {
  left: 0;
  width: 165px;
  height: 150px;
  background: #fb995f;
  border-radius: 82px 82px 0 0;
  z-index: 3;
}
.char-purple {
  left: 190px;
  width: 105px;
  height: 160px;
  background: #8a67c8;
  border-radius: 52px 52px 0 0;
  z-index: 4;
}

.eyes {
  position: absolute;
  display: flex;
}
.eyeball {
  border-radius: 999px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 120ms ease;
}
.pupil {
  border-radius: 999px;
  background: #2d2d2d;
}
.bare-pupil {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #2d2d2d;
  transition: transform 120ms ease;
}
.yellow-mouth {
  position: absolute;
  height: 3px;
  background: #2d2d2d;
  border-radius: 999px;
}

@media (max-width: 1023px) {
  .characters-scene {
    display: none;
  }
}
</style>
