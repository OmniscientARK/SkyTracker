<template>
    <form action="javascript:void(0)" @submit="onSubmit">
        <input type="text" placeholder="Enter player name"/>
        <input type="submit" value="SEARCH"/>
    </form>
</template>

<script>
export default {
    methods: {
        onSubmit(e){
            let input = e.target.querySelector("form > input[type=text]")
            if(input.value.length === 0) return
            window.location.pathname = `/stats/${input.value}`
        }
    },
    mounted(){
        console.log(this.$root.error)
        window.history.replaceState({}, document.title, `/`)
    }
}
</script>

<style scoped>
form{
    padding: 5rem;
    border-radius: 1rem;
    margin: auto;
    display: flex;
    flex-direction: column;
}
form > input{
    flex-grow: 0;
    margin: auto;
    font-size: 1.25rem;
}
form > input:not(:last-child){

    margin-bottom: .5rem;
}
</style>