<script>
export default {
  name: "CursedBackground"
};
</script>

<template>
  <div
    class="c-cursed-background-overlay"
  />
</template>

<style scoped>
.c-cursed-background-overlay {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -2;
  background: radial-gradient(#ffff00, #ffc000, #ff8000, #ff4000, #ff0000, #c00000, #800000, #400000,
    black, black, black, black, black, black, black, black, black, black, black, black, black, black, black, black);
  background-size: 1200% 400%;
  animation: a-cursed-background-shift 240s linear infinite;
}

@keyframes a-cursed-background-shift {
  0% {
    background-position: 50% 0%;
  }
  50% {
    background-position: 50% 30%;
  }
  100% {
    background-position: 50% 0%;
  }
}
</style>
