<template>
    <span class="highlight" @mouseenter="showSelector" @mouseleave="hideSelector">
        <slot></slot>
        <ul class="selector">
            <li class="item" v-for="item in items" :key="item.id">
                <a :href="item.href">{{item.title}}</a>
            </li>
        </ul>
    </span>
</template>

<script>
export default {
    props: {
        items: Array
    },
    methods: {
        showSelector(e){
            let selector = e.target.querySelector(".selector")
            selector.style.visibility = "visible"
        },
        hideSelector(e){
            let selector = e.target.querySelector(".selector")
            selector.style.visibility = "hidden"
        }
    }
}
</script>

<style>
.highlight{
    font-weight: 600;
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    position: relative;
    padding: .25em .5em .25em .5em;
    margin: 0 .3em;
    z-index: 1;
}
.highlight::before{
    z-index: -1;
    content: "";
    position: absolute;
    border-radius: 10000px;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    width: 100%;
    height: 100%;
    background-color: var(--clr-neutral-500);
    opacity: .3;
    transition: opacity var(--delay) var(--timing);
}
.highlight:hover::before{
    opacity: .5;
}
.highlight:hover{
    cursor: pointer;
}

.selector{
    visibility: hidden;
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    background-color: var(--clr-neutral-700);
    list-style: none;
    border-radius: .75em;
    padding: 0;
    font-size: .8em;
    overflow: hidden;
}
.selector > .item{
    border-bottom: 1px solid var(--clr-neutral-600);  
    transition: background-color var(--delay) var(--timing);
}
.selector > .item:last-child{
    border-bottom: none
}
.selector > .item:hover{
    background-color: var(--clr-neutral-600);
}
.selector > .item > a{
    display: flex;
    width: 100%;
    height: 100%;
    padding: .75em; 
}
</style>