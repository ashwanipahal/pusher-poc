import todoList from "../data";
import pusher from '../pusher'

export const resolvers = {
  Query: {
    todoItems: ()=> {
        return todoList;
    }
  },  
  Mutation: {
    addTodo(root, args, context, info) {
      const todoId = todoList.length + 1;
      const todoItem = {
        item:args.item,
        id: todoId,
        publishedAt: new Date().toISOString()
      };
      pusher.trigger("private-pusher-poc", "my-event", todoItem);
      todoList.push(todoItem);
      return todoItem;
    }
  }
};

