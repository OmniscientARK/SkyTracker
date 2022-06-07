<template>
    <nav>
        <a class="logo" href="/">SkyTracker</a>
        <form class="query" action="javascript:void(0)" @submit="onSubmit">
            <input type="text" placeholder="Enter player name"/>
            <input type="submit" value="SEARCH"/>
        </form>
        <button id="settings" class="dark square">⚙️</button>
    </nav>
</template>

<script>
export default {
    methods: {
        onSubmit(e){
            let input = e.target.querySelector("form > input[type=text]")
            if(input.value.length === 0) return
            window.location.pathname = `/stats/${input.value}`
        }
    }
}
</script>

<style scoped>
nav{
    width: 100%;
    display: flex;
    flex-direction: row;
    background-color: var(--clr-neutral-700);
    padding: .25rem;
    height: fit-content;
    justify-content: space-between;
}

nav > *{
    margin: auto 0;
}

nav > .logo{
    padding-left: 1rem;
    font-weight: 700;
    font-size: 1.25rem;
}
nav > .panel{
    padding-right: 1rem;
}
</style>