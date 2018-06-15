<template>
  <section class="real-app">
    <input
      type="text"
      class="add-input"
      autofocus="autofocus"
      placeholder="接下去要做什么？"
      @keyup.enter="addTodo"
    >
    <item 
      :todo="todo"
      v-for="todo in filteredTodos"
      :key="todo.id"
      @del="deleteTodo"
      @check="checkboxClick"
    />
    <tabs 
      :filter="filter" 
      :todos="todos"
      @toggle="toggleFilter"
      @clearAllCompleted="clearAllCompleted"
    />
  </section>
</template>

<script>
import Item from './item.vue'
import Tabs from './tabs.vue'
let id = 0
export default {
  data() {
    return {
      todos: [],
      filter: '全部'
    }
  },
  components: {
    Item,
    Tabs
  },
  computed: {
    filteredTodos() {
      if (this.filter === '全部') {
        return this.todos
      }
      const completed = this.filter === '已完成'
      return this.todos.filter(todo=> completed === todo.completed)
    }
  },
  methods: {
    // 新增 item
    addTodo(e) {
      this.todos.unshift({
        id: id++,
        content: e.target.value.trim(),
        completed: false
      })
      e.target.value = ''
    },
    // 删除 item
    deleteTodo(id) {
      this.todos.splice(this.todos.findIndex(todo => todo.id === id), 1)
    },
    // 点击 item 等于点击选中
    checkboxClick(id) {
      this.todos.forEach(function(e){
        if (e.id === id) {
          e.completed = !e.completed
        }
      })
    },
    // 变换选中的状态
    toggleFilter(state) {
      this.filter = state
    },
    clearAllCompleted() {
      this.todos = this.todos.filter(todo => !todo.completed)
    }
  }
}
</script>

<style lang="stylus" scoped>
.real-app {
  width 600px
  margin 0 auto 
  box-shadow 0 0 5px #666
}
.add-input {
  position relative
  margin 0
  width 100%
  font-size 24px
  font-family inherit
  font-weight inherit 
  line-height 1.4em
  outline none 
  color inherit 
  box-sizing border-box
  font-smoothing antialiased 
  padding 16px 16px 16px 60px
  border none 
  box-shadow inset 0 -2px 1px rgba(0,0,0,0.5)
}
</style>

