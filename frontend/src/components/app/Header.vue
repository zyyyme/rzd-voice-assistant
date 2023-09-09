<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
    <header>
        <div class="navbar bg-base-100 container mx-auto">
            <div class="navbar-start">
            <div class="dropdown">
                <label tabindex="0" class="btn btn-ghost lg:hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                </label>
                <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                    <li>
                        <RouterLink to="/search">Поиск</RouterLink>
                    </li>
                    <li>
                        <RouterLink to="bd">База знаний</RouterLink>
                        <ul class="p-2">
                            <li><RouterLink to="">Глоссарий</RouterLink></li>
                            <li><RouterLink to="/knowledge-base">Инструкции</RouterLink></li>
                        </ul>
                    </li>
                    <li><RouterLink to="/history">История</RouterLink></li>
                </ul>
            </div>
            <a href="/" class="btn btn-ghost normal-case text-xl">
                <img src="/svg/logo.svg" alt=""> x 23:59
            </a>
            </div>
            <div class="navbar-center hidden lg:flex">
            <ul class="menu menu-horizontal px-1">
                <li><RouterLink to="/search">Поиск</RouterLink></li>
                <li tabindex="0">
                <details>
                    <summary>База знаний</summary>
                    <ul class="p-2">
                        <li><a>Глоссарий</a></li>
                        <li><a>Инструктции</a></li>
                    </ul>
                </details>
                </li>
                <li><RouterLink to="/history">История</RouterLink></li>
            </ul>
            </div>
            <div class="navbar-end">
                <a id="auth-link" class="btn btn-primary">Войти</a>
            </div>
        </div>
    </header>
</template>