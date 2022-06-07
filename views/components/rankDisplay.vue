<template>
    <span class="display">
        <span class="rank" :style="{backgroundColor: `var(--${rank.color})`}">{{title}}</span><span class="plus" :style="{backgroundColor: `var(--${rank.plusColor})`}" v-if="plusCount > 0">{{"+".repeat(plusCount)}}</span>
    </span>
</template>

<script>
export default {
    props: {
        rank: Object
    },
    data() {
        return{
            title: this.rank.type.replaceAll("+", ""),
            plusCount: this.rank.type.split("+").length-1
        }
    }
}
</script>

<style scoped>
.display{
    font-size: .7em;
    display: inline-block;
    border-radius: 10000px;
    overflow: hidden;
    margin-right: .3em;
    font-weight: 700;
}
.display > .rank, .display > .plus{
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    padding-top: .25em;  
    padding-bottom: .25em;
}
.display > span:first-child{
    padding-left: .5em;
    padding-right: .25em;
    border-top-left-radius: 10000px;
    border-bottom-left-radius: 10000px;
}
.display > span:last-child{
    padding-right: .5em;
    padding-left: .25em;
    border-top-right-radius: 10000px;
    border-bottom-right-radius: 10000px;
}
.display > span:only-child{
    padding-left: .5em;
    padding-right: .5em;
}
</style>