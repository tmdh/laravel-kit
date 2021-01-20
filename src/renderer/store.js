import Vue from "vue";
import Vuex from "vuex";
import Project from "@/api/Project";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    project: null
  },
  mutations: {
    openProject(state, dir) {
      state.project = new Project(dir);
    }
  },
  getters: {
    searchResults: state => keyword => {
      return state.project.commands.filter(command => command.name.includes(keyword)).sort((a, b) => (a.name > b.name ? 1 : -1)); // function(a, b){return a.name > b.name ? 1 : -1})
    },
    getCommand: state => name => {
      return state.project.commands.find(command => command.name == name);
    }
  }
});
