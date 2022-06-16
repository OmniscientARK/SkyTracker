<template>
  <div class="slot" :style="{backgroundColor: `var(--§${{COMMON: 'f', UNCOMMON: 'a', RARE: '9', EPIC: '5', LEGENDARY: '6', MYTHIC: 'd', SPECIAL: 'c'}[item.attributes.rarity] || 'c'})`}">

  </div>
</template>

<script>
export default {
    props: {
        item: Object
    }
}
</script>

<style scoped>
.slot{
    width: 4rem;
    aspect-ratio: 1 / 1;
    border: 1px solid black;
    border-radius: .5rem;
}
</style>