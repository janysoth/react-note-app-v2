import moment from "moment";
import { Task } from "./types";

export const formatTime = (createdAt: string) => {
  const now = moment();
  const created = moment(createdAt);

  // if the task was created today
  if (created.isSame(now, "day")) {
    return "Today";
  }

  // if the task was created yesterday
  if (created.isSame(now.subtract(1, "days"), "day")) {
    return "Yesterday";
  }

  // check if created within the last 7 days
  if (created.isAfter(moment().subtract(6, "days"))) {
    return created.fromNow();
  }

  // if item was created within the last 4 weeks (up to 1 month ago)
  if (created.isAfter(moment().subtract(3, "weeks"), "week")) {
    return created.fromNow();
  }

  return created.format("MM/DD/YYYY");
};

export const formatDueDate = (date: string) => {
  const now = moment.utc().startOf('day'); // Start of today
  const givenDate = moment.utc(date).startOf('day'); // Start of given date (dueDate)
  const withinSevenDays = now.clone().add(7, "days");
  const withinOneMonth = now.clone().add(4, 'weeks');

  // If the task is due today
  if (givenDate.isSame(now, 'day')) {
    return 'Today';
  }

  // If the task is due tomorrow
  const tomorrow = moment.utc().add(1, 'days').startOf('day');
  if (givenDate.isSame(tomorrow, 'day')) {
    return 'Tomorrow';
  }

  // If the task was due yesterday
  const yesterday = moment.utc().subtract(1, 'days').startOf('day');
  if (givenDate.isSame(yesterday, 'day')) {
    return 'Yesterday';
  }

  // // If the task is due within the last 7 days
  if (givenDate.isBefore(withinSevenDays))
    return givenDate.fromNow();

  // if (givenDate.isSame(withinSevenDays, "day"))
  //   return givenDate.fromNow();

  if (givenDate.isAfter(withinSevenDays) && givenDate.isBefore(withinOneMonth))
    return givenDate.fromNow();

  // For any other past dates, return the full date in MM/DD/YYYY format
  return givenDate.format('MM/DD/YYYY');
};

export const filteredTasks = (tasks: Task[], priority: string) => {
  const filteredTasks = () => {
    switch (priority) {
      case "low":
        return tasks.filter((task) => task.priority === "low");
      case "medium":
        return tasks.filter((task) => task.priority === "medium");
      case "high":
        return tasks.filter((task) => task.priority === "high");
      default:
        return tasks;
    }
  };

  return filteredTasks();
};

export const overdueTasks = (tasks: Task[]) => {
  const todayDate = moment();

  // filter tasks that are not completed and the due date is before today
  return tasks.filter((task) => {
    return !task.completed && moment(task.dueDate).isBefore(todayDate);
  });
};

// Sort Tasks by earliest due date
export const sortTasksByDueDate = (tasks: Task[]) => {
  return tasks.sort((taskA, taskB) => {
    const taskADueDate = new Date(taskA.dueDate).getTime();
    const taskBDueDate = new Date(taskB.dueDate).getTime();

    return taskADueDate - taskBDueDate; // Sort in ascending order
  });
};
