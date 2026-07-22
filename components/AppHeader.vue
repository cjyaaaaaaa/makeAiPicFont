<template>
  <header
    class="fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300"
    :class="headerSurfaceClass"
  >
    <div
      class="mx-auto flex h-[64px] max-w-[1440px] items-center justify-between gap-4 px-4 md:px-6 lg:px-8"
    >
      <NuxtLink
        :to="localizedHomePath"
        class="flex items-center gap-2 text-[#f8fafc]"
        :aria-label="headerSiteName"
      >
        <img
          src="/gptpix-logo.svg"
          :alt="headerSiteName"
          class="h-8 w-8 rounded-[7px] object-cover"
        />
        <span class="text-[20px] font-semibold tracking-[-0.03em]">{{ headerSiteName }}</span>
      </NuxtLink>

      <nav class="hidden items-center gap-8 lg:flex" aria-label="Primary">
        <NuxtLink
          v-for="item in navItems"
          :key="item.link"
          :to="item.link"
          class="flex items-center gap-2 text-[14px] leading-5 text-[#a8b3c7] transition hover:text-[#f8fafc]"
        >
          <span>{{ item.label }}</span>
        </NuxtLink>
      </nav>

      <div class="flex items-center gap-2 md:gap-3">
        <button
          type="button"
          class="inline-flex h-8 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 text-[14px] font-medium text-[#f8fafc] transition hover:border-white/20 hover:bg-white/10"
          @click="openLang = true"
        >
          <svg
            class="h-4 w-4"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <circle
              cx="10"
              cy="10"
              r="7.5"
              stroke="currentColor"
              stroke-width="1.35"
            />
            <path
              d="M2.8 10H17.2M10 2.5C12 4.5 13 7 13 10C13 13 12 15.5 10 17.5M10 2.5C8 4.5 7 7 7 10C7 13 8 15.5 10 17.5"
              stroke="currentColor"
              stroke-width="1.35"
              stroke-linecap="round"
            />
          </svg>
          <span>{{ currentShortLabel }}</span>
        </button>
        <div v-if="isSignedIn" class="relative">
          <button
            type="button"
            class="inline-flex h-9 items-center gap-2 rounded-full bg-[#2450c9] py-1 pl-1 pr-3 text-[13px] font-medium text-white shadow-[0_10px_26px_rgba(36,80,201,0.28)] transition hover:bg-[#2f5fe2]"
            @click="userMenuOpen = !userMenuOpen"
          >
            <span
              class="grid h-7 w-7 place-items-center overflow-hidden rounded-full bg-[#ef4d2c] text-[12px] font-semibold"
            >
              <img
                v-if="user?.avatar"
                :src="user.avatar"
                alt=""
                class="h-full w-full object-cover"
              />
              <span v-else>{{ userInitial }}</span>
            </span>
            <span class="max-w-[72px] truncate">{{ shortUserName }}</span>
            <svg
              class="h-3.5 w-3.5 text-white/75 transition"
              :class="{ 'rotate-180': userMenuOpen }"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M5 7.5L10 12.5L15 7.5"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
          <div
            v-if="userMenuOpen"
            class="fixed inset-0 z-[60]"
            @click="userMenuOpen = false"
          ></div>
          <div
            v-if="userMenuOpen"
            class="absolute right-0 top-11 z-[70] w-[255px] rounded-[8px] border border-white/10 bg-[#070707] p-1 shadow-[0_22px_70px_rgba(0,0,0,0.45)]"
          >
            <div class="px-5 pb-4 pt-5">
              <div class="truncate text-[18px] font-semibold text-white">
                {{ displayUserName }}
              </div>
              <div class="mt-1 truncate text-[14px] text-white/55">
                {{ user?.email }}
              </div>
            </div>
            <div class="mx-1 h-px bg-white/10"></div>
            <div class="py-2">
              <div
                class="flex items-center gap-4 px-5 py-3 text-[15px] text-white"
              >
                <svg
                  class="h-5 w-5 text-[#f4d317]"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    cx="9"
                    cy="9"
                    r="4"
                    stroke="currentColor"
                    stroke-width="1.8"
                  />
                  <path
                    d="M14.5 13.5C16.7 13.5 18.5 11.7 18.5 9.5M18.5 9.5L20.5 9.5M18.5 9.5V7.5M13 17.5C15.8 17.5 18 15.3 18 12.5"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                  />
                </svg>
                <span>{{ t("account.credits", { count: userCredits }) }}</span>
              </div>
              <button
                type="button"
                class="flex w-full items-center gap-4 px-5 py-3 text-left text-[15px] text-white transition hover:bg-white/5"
                @click="goToAccountSettings"
              >
                <svg
                  class="h-5 w-5 text-[#2f80ff]"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M12 12.5A3.5 3.5 0 1 0 12 5.5A3.5 3.5 0 0 0 12 12.5Z"
                    stroke="currentColor"
                    stroke-width="1.8"
                  />
                  <path
                    d="M6.5 20C7.2 17.3 9.2 15.8 12 15.8C14.8 15.8 16.8 17.3 17.5 20"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                  />
                </svg>
                <span>{{ t("account.settings") }}</span>
              </button>
              <button
                type="button"
                class="flex w-full items-center gap-4 px-5 py-3 text-left text-[15px] text-white transition hover:bg-white/5"
              >
                <svg
                  class="h-5 w-5 text-[#a855f7]"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <rect
                    x="4.5"
                    y="7"
                    width="15"
                    height="10"
                    rx="1.6"
                    stroke="currentColor"
                    stroke-width="1.8"
                  />
                  <path
                    d="M4.5 10H19.5"
                    stroke="currentColor"
                    stroke-width="1.8"
                  />
                </svg>
                <span>{{ t("account.subscription") }}</span>
              </button>
            </div>
            <div class="mx-1 h-px bg-white/10"></div>
            <button
              type="button"
              class="flex w-full items-center gap-4 px-5 py-4 text-left text-[15px] text-[#ff3b3b] transition hover:bg-white/5"
              @click="handleLogout"
            >
              <svg
                class="h-5 w-5 text-white/45"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M10 6H6.5C5.7 6 5 6.7 5 7.5V16.5C5 17.3 5.7 18 6.5 18H10"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                />
                <path
                  d="M14 8L18 12L14 16"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M18 12H9"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                />
              </svg>
              <span>{{ t("account.signOut") }}</span>
            </button>
          </div>
        </div>
        <button
          v-else
          type="button"
          class="hidden h-8 items-center rounded-full bg-[#ef4d2c] px-3 text-[14px] font-medium text-white shadow-[0_10px_28px_rgba(239,77,44,0.24)] transition hover:bg-[#ff6a45] sm:inline-flex"
          @click="openLogin = true"
        >
          {{ t("auth.login") }}
        </button>
      </div>
    </div>

    <div
      v-if="openLang"
      class="fixed inset-0 z-[70] bg-black/55 px-3 py-4 backdrop-blur-[2px] md:px-4"
      @click.self="openLang = false"
    >
      <div
        class="ml-auto mt-0 w-full max-w-[340px] rounded-[24px] border border-white/10 bg-[#101622] p-3 shadow-[0_28px_90px_rgba(0,0,0,0.42)] sm:w-[340px] sm:p-4"
      >
        <div class="mb-3 flex items-center justify-between px-1">
          <h3 class="text-[18px] font-semibold text-[#f8fafc]">
            {{ t("common.language") }}
          </h3>
          <button
            type="button"
            class="grid h-8 w-8 place-items-center rounded-full bg-white/5 text-[28px] leading-none text-[#a8b3c7] transition hover:bg-white/10 hover:text-white"
            @click="openLang = false"
          >
            ×
          </button>
        </div>
        <div class="grid gap-3">
          <button
            v-for="item in languages"
            :key="item.code"
            type="button"
            class="flex items-center justify-between rounded-[18px] border px-4 py-4 text-left transition duration-200"
            :class="
              locale === item.code
                ? 'border-[#ef4d2c] bg-[#2a1511] shadow-[0_8px_28px_rgba(239,77,44,0.16)]'
                : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
            "
            @click="switchLanguage(item.code)"
          >
            <span class="text-[18px] font-semibold text-[#f8fafc]">{{
              item.name
            }}</span>
            <small
              class="text-[13px] font-medium tracking-[0.16em] text-[#7f8da5]"
              >{{ item.code.toUpperCase() }}</small
            >
          </button>
        </div>
      </div>
    </div>

    <LoginModal
      :open="openLogin"
      @close="openLogin = false"
      @email="handleEmailLogin"
    />
  </header>
</template>

<script setup lang="ts">
import LoginModal from "~/components/auth/LoginModal.vue";

const { t, locale, setLocale } = useAppI18n();
const { showTipToast } = useTipToast();
const { user, initUser, loginWithToken, logout } = useUser();
const route = useRoute();
const openLang = ref(false);
const openLogin = ref(false);
const userMenuOpen = ref(false);
const headerSiteName = computed(() => t("common.siteName"));
const languages = [
  { code: "zh", name: "简体中文", short: "中" },
  { code: "en", name: "English", short: "EN" },
  { code: "de", name: "Deutsch", short: "DE" },
  { code: "es", name: "Español", short: "ES" },
  { code: "ja", name: "日本語", short: "JA" },
] as const;
type LocaleCode = (typeof languages)[number]["code"];

const localeCodes = languages.map((item) => item.code);
const currentShortLabel = computed(
  () => languages.find((item) => item.code === locale.value)?.short ?? "EN",
);
const defaultLocale: LocaleCode = "en";
const localizedHomePath = computed(() =>
  locale.value === defaultLocale ? "/" : `/${locale.value}`,
);
const getPathLocale = (path: string) => {
  const firstSegment = path.split("/").filter(Boolean)[0];
  return localeCodes.includes(firstSegment as LocaleCode)
    ? (firstSegment as LocaleCode)
    : null;
};
const stripLocalePrefix = (path: string) => {
  const currentPathLocale = getPathLocale(path);
  if (!currentPathLocale) return path || "/";
  const stripped = path.replace(
    new RegExp(`^/${currentPathLocale}(?=/|$)`),
    "",
  );
  return stripped || "/";
};
const buildLocalePath = (code: LocaleCode, fullPath: string) => {
  const [pathWithQuery, hash = ""] = fullPath.split("#");
  const [pathOnly, query = ""] = pathWithQuery.split("?");
  const strippedPath = stripLocalePrefix(pathOnly);
  const localizedPath =
    code === defaultLocale
      ? strippedPath
      : `/${code}${strippedPath === "/" ? "" : strippedPath}`;
  return `${localizedPath}${query ? `?${query}` : ""}${hash ? `#${hash}` : ""}`;
};
const localizeNavPath = (path: string) =>
  buildLocalePath(locale.value as LocaleCode, path);

const isMarketingHome = computed(() => {
  const stripped = stripLocalePrefix(route.path);
  return stripped === "/";
});
const isOverHero = ref(true);
const isHeaderOpaque = computed(
  () => !isMarketingHome.value || !isOverHero.value,
);
const headerSurfaceClass = computed(() =>
  isHeaderOpaque.value
    ? "border-b border-white/10 bg-[#15161a]"
    : "border-b border-transparent bg-transparent",
);

let heroObserver: IntersectionObserver | null = null;

const disconnectHeroObserver = () => {
  heroObserver?.disconnect();
  heroObserver = null;
};

const observeHeroSection = () => {
  if (!import.meta.client) return;
  disconnectHeroObserver();

  if (!isMarketingHome.value) {
    isOverHero.value = false;
    return;
  }

  const attach = (attempt = 0) => {
    if (!isMarketingHome.value) return;
    const hero = document.querySelector(".particle-hero");
    if (!hero) {
      isOverHero.value = true;
      if (attempt < 8) {
        window.setTimeout(() => attach(attempt + 1), 50);
      }
      return;
    }

    heroObserver = new IntersectionObserver(
      ([entry]) => {
        isOverHero.value = Boolean(entry?.isIntersecting);
      },
      {
        threshold: 0,
        // Treat header height as off-limits so solid kicks in as the next section arrives
        rootMargin: "-64px 0px 0px 0px",
      },
    );
    heroObserver.observe(hero);
    isOverHero.value = true;
  };

  attach();
};

const navItems = computed(() => [
  { label: t("nav.home"), link: localizeNavPath("/home") },
  { label: t("nav.aiImage"), link: localizeNavPath("/ai-image-generator") },
  { label: t("nav.aiVideo"), link: localizeNavPath("/ai-video-generator") },
  { label: t("nav.assets"), link: localizeNavPath("/assets") },
  { label: t("nav.explore"), link: localizeNavPath("/explore") },
  { label: t("nav.pricing"), link: localizeNavPath("/pricing") },
]);
const syncLocaleFromRoute = () => {
  const routeLocale = getPathLocale(route.path);
  const nextLocale = routeLocale ?? defaultLocale;
  if (nextLocale !== locale.value) {
    setLocale(nextLocale);
  }
};
const switchLanguage = async (code: LocaleCode) => {
  setLocale(code);
  openLang.value = false;
  await navigateTo(buildLocalePath(code, route.fullPath));
};
const isSignedIn = computed(() => Boolean(user.value));
const displayUserName = computed(
  () => user.value?.nickName || user.value?.userName || user.value?.email || "",
);
const shortUserName = computed(() => {
  const name = displayUserName.value;
  return name.length > 3 ? name.slice(0, 3) : name;
});
const userInitial = computed(
  () => displayUserName.value.slice(0, 1).toUpperCase() || "U",
);
const userCredits = computed(() => user.value?.creditBalance ?? 0);


const handleEmailLogin = () => {};

const handleLogout = () => {
  logout();
  userMenuOpen.value = false;
  openLogin.value = false;
};

const goToAccountSettings = async () => {
  userMenuOpen.value = false;
  await navigateTo(localizeNavPath("/account/profile"));
};

onMounted(() => {
  if (process.client) {
    syncLocaleFromRoute();
    void initUser().catch(() => logout());
    nextTick(() => observeHeroSection());
  }
});

onBeforeUnmount(() => {
  disconnectHeroObserver();
});

watch(
  () => route.fullPath,
  () => {
    syncLocaleFromRoute();
    nextTick(() => observeHeroSection());
  },
);
</script>
