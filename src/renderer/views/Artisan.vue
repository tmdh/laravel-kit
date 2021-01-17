<template>
  <div class="flex flex-row flex-1">
    <div class="bg-gray-100 w-72 flex flex-col">
      <h1 class="uppercase font-bold text-gray-500 px-5 pt-5 pb-4">Artisan</h1>
      <div class="px-3 pb-3">
        <input type="text" class="w-full h-7 border-input border-gray-300 border rounded placeholder-gray-800 px-2.5 text-sm hover:border-gray-400 focus:outline-none focus:border-gray-500" placeholder="Search" />
      </div>
      <div class="overflow-scroll overflow-x-hidden flex-1 flex flex-col pb-4">
        <span class="py-1.5 hover:bg-gray-200 text-xs font-mono px-6">help</span>
        <span class="py-1.5 hover:bg-gray-200 text-xs font-mono px-6">cache:clear</span>
        <span class="py-1.5 bg-gray-300 text-xs font-mono px-6">make:controller</span>
        <span class="py-1.5 hover:bg-gray-200 text-xs font-mono px-6">make:migration</span>
        <span class="py-1.5 hover:bg-gray-200 text-xs font-mono px-6">make:auth</span>
        <span class="py-1.5 hover:bg-gray-200 text-xs font-mono px-6">key:generate</span>
        <span class="py-1.5 hover:bg-gray-200 text-xs font-mono px-6">queue:clear</span>
        <span class="py-1.5 hover:bg-gray-200 text-xs font-mono px-6">db:wipe</span>
        <span class="py-1.5 hover:bg-gray-200 text-xs font-mono px-6">help</span>
        <span class="py-1.5 hover:bg-gray-200 text-xs font-mono px-6">cache:clear</span>
        <span class="py-1.5 hover:bg-gray-200 text-xs font-mono px-6">make:controller</span>
        <span class="py-1.5 hover:bg-gray-200 text-xs font-mono px-6">make:migration</span>
        <span class="py-1.5 hover:bg-gray-200 text-xs font-mono px-6">make:auth</span>
        <span class="py-1.5 hover:bg-gray-200 text-xs font-mono px-6">key:generate</span>
        <span class="py-1.5 hover:bg-gray-200 text-xs font-mono px-6">queue:clear</span>
        <span class="py-1.5 hover:bg-gray-200 text-xs font-mono px-6">db:wipe</span>
        <span class="py-1.5 hover:bg-gray-200 text-xs font-mono px-6">help</span>
        <span class="py-1.5 hover:bg-gray-200 text-xs font-mono px-6">cache:clear</span>
        <span class="py-1.5 hover:bg-gray-200 text-xs font-mono px-6">make:controller</span>
        <span class="py-1.5 hover:bg-gray-200 text-xs font-mono px-6">make:migration</span>
        <span class="py-1.5 hover:bg-gray-200 text-xs font-mono px-6">make:auth</span>
        <span class="py-1.5 hover:bg-gray-200 text-xs font-mono px-6">key:generate</span>
        <span class="py-1.5 hover:bg-gray-200 text-xs font-mono px-6">queue:clear</span>
        <span class="py-1.5 hover:bg-gray-200 text-xs font-mono px-6">db:wipe</span>
        <span class="py-1.5 hover:bg-gray-200 text-xs font-mono px-6">help</span>
        <span class="py-1.5 hover:bg-gray-200 text-xs font-mono px-6">cache:clear</span>
        <span class="py-1.5 hover:bg-gray-200 text-xs font-mono px-6">make:controller</span>
        <span class="py-1.5 hover:bg-gray-200 text-xs font-mono px-6">make:migration</span>
        <span class="py-1.5 hover:bg-gray-200 text-xs font-mono px-6">make:auth</span>
        <span class="py-1.5 hover:bg-gray-200 text-xs font-mono px-6">key:generate</span>
        <span class="py-1.5 hover:bg-gray-200 text-xs font-mono px-6">queue:clear</span>
        <span class="py-1.5 hover:bg-gray-200 text-xs font-mono px-6">db:wipe</span>
      </div>
    </div>
    <div class="bg-gray-100 flex flex-col flex-1">
      <div class="flex justify-between items-center">
        <h1 class="font-bold px-5 py-4 text-gray-500">{{ project.name }}</h1>
        <div class="mr-2">
          <a class="underline hover:text-blue mr-2 cursor-pointer">http://127.0.0.1:8000</a>
          <button class="bg-green hover:bg-green-100 w-29 py-2 text-white rounded text-xs mx-1 focus:outline-none focus:ring-2 focus:ring-green">Serve</button>
          <button class="bg-blue hover:bg-blue-100 w-29 py-2 text-white rounded text-xs mx-1 focus:outline-none focus:ring-2">Open folder</button>
          <button class="bg-blue hover:bg-blue-100 w-29 py-2 text-white rounded text-xs mx-1 focus:outline-none focus:ring-2">Open In Editor</button>
        </div>
      </div>
      <div class="bg-white-100 flex-1 overflow-y-auto pl-7 pr-2 py-5 text-xl">
        <div class="flex justify-between">
          <h1 class="font-mono text-xl">make:controller</h1>
          <button class="bg-blue hover:bg-blue-100 w-29 py-2 text-white rounded text-xs mx-1 focus:outline-none focus:ring-2">Run</button>
        </div>
        <p class="mt-5 mb-3 text-base">Create a new controller class</p>
        <div class="h-px bg-gray-300"></div>
        <h2 class="text-gray-800 font-bold text-base mt-4">Arguments</h2>
        <div class="flex flex-row py-2">
          <div class="w-64">
            <span class="text-sm text-gray-900">name</span>
          </div>
          <div class="flex flex-col">
            <input type="text" class="h-7 w-72 border-input border-gray-300 border rounded placeholder-gray-800 px-2.5 text-sm hover:border-gray-400 focus:outline-none focus:border-gray-500" placeholder="Search" />
            <span class="text-xs text-gray-600 mt-1">The name of the class</span>
          </div>
        </div>
        <h2 class="text-gray-800 font-bold text-base mt-4">Options</h2>
        <div class="flex flex-row py-2">
          <div class="w-64">
            <span class="text-sm text-gray-900">api</span>
          </div>
          <div class="flex flex-row items-center">
            <input type="checkbox" class="w-4 h-4 rounded-md text-blue-100 focus:ring-0 hover:text-blue hover:border-gray-900" id="api" />
            <label class="ml-2 text-sm text-gray-600" for="api">Exclude the create and edit methods from the controller.</label>
          </div>
        </div>
        <div class="flex flex-row py-2">
          <div class="w-64">
            <span class="text-sm text-gray-900">force</span>
          </div>
          <div class="flex flex-row items-center">
            <input type="checkbox" class="w-4 h-4 rounded-md text-blue-100 focus:ring-0 hover:text-blue  hover:border-gray-900" id="force" />
            <label class="ml-2 text-sm text-gray-600" for="force">Create the class even if the controller already exists</label>
          </div>
        </div>
        <div class="flex flex-row py-2">
          <div class="w-64">
            <span class="text-sm text-gray-900">invokable</span>
          </div>
          <div class="flex flex-row items-center">
            <input type="checkbox" class="w-4 h-4 rounded-md text-blue-100 focus:ring-0 hover:text-blue  hover:border-gray-900" id="invokable" />
            <label class="ml-2 text-sm text-gray-600" for="invokable">Generate a single method, invokable controller class.</label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Artisan",
  computed: mapState({
    project: state => state.project
  })
};
</script>

<style></style>
