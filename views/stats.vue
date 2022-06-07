<template>
    <section>
        <Navigation/>
        <section>
            <h1 class="heading">
                Stats for
                <Selector>
                    <RankDisplay :rank="$root.player.rank"/>
                    {{$root.player.name}}
                </Selector>
                on
                <Selector :items="$root.player.skyblock.profiles.map(profile => {
                    return {
                        id: profile.id,
                        title: profile.name,
                        href: `/stats/${$root.player.name}/${profile.name}`
                    }
                }).filter(profile => profile.id !== $root.profile.id)">{{$root.profile.name}}</Selector>
            </h1>
        </section>
    </section>
</template>

<script>
import Navigation from "./components/navigation.vue"
import RankDisplay from "./components/rankDisplay.vue"
import Selector from "./components/selector.vue"
export default {
    components: {
        Navigation, RankDisplay, Selector
    },
    mounted() {
        window.history.replaceState({}, document.title, `/stats/${this.$root.player.name}/${this.$root.profile.name}`)
    }
}
</script>

<style scoped>
.heading{
    display: flex;
    flex-direction: row;
    align-items: center;
    font-weight: 400;
}
</style>