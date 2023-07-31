import todoList from "../data";
import pusher from '../pusher'

export const resolvers = {
  Query: {
    todoItems: ()=> {
        return todoList;
    }
  },  
  Mutation: {
    addTodo(_root, args, _context, _info) {
      const todoId = todoList.length + 1;
      const todoItem = {
        item:args.item,
        id: todoId,
        publishedAt: new Date().toISOString()
      };
      const channelName = "private-pusher-poc"; 
      const eventName = "my-event";
      pusher.trigger(channelName, eventName, todoItem);
      todoList.push(todoItem);
      return todoItem;
    }
  }
};

