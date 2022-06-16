<template>
    <section>
        <Navigation/>
        <section>
            <h1 class="heading">
                Stats for
                <Selector :items="$root.profile.members.map(member => {
                    return {
                        id: member.uuid,
                        title: member.name,
                        href: `/stats/${member.name}/${member.profile.name}`
                    }
                }).filter(member => member.id !== $root.player.uuid)">
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
                }).filter(profile => profile.id !== $root.profile.id)">{{$root.player.skyblock.profiles.find(profile => profile.id === $root.profile.id).name}}</Selector>
            </h1>
            <InventorySlot :item="$root.profile.inventory.armor[0]"></InventorySlot>
            <pre>
                {{JSON.stringify($root.profile.inventory, null, "\t")}}
            </pre>
        </section>
    </section>
</template>

<script>
import Navigation from "./components/navigation.vue"
import RankDisplay from "./components/rankDisplay.vue"
import Selector from "./components/selector.vue"
import InventorySlot from "./components/inventorySlot.vue"
export default {
    components: {
        Navigation, RankDisplay, Selector, InventorySlot
    },
    mounted() {
        window.history.replaceState({}, document.title, `/stats/${this.$root.player.name}/${this.$root.player.skyblock.profiles.find(profile => profile.id === this.$root.profile.id).name}`)
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