import PlusIcon from "../../assets/icons/PlusIcon";
import { useMemo, useState } from "react";
import ColumnContainer from "./ColumnContainer";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";
import { Statuses } from "../../constant";

// const defaultCols = [
//   {
//     id: "todo",
//     title: "Todo",
//   },
//   {
//     id: "doing",
//     title: "Work in progress",
//   },
//   {
//     id: "done",
//     title: "Done",
//   },
// ];

const defaultTasks = [
  {
    id: "1",
    columnId: 1,
    content: {
      orderDate:'28-08-2023',
      customerName:'Alex',
      orderId: '00023'
    }
  },
  {
    id: "2",
    columnId: 2,
    content: {
      orderDate:'28-08-2023',
      customerName:'John',
      orderId: '00023'
    }
  },
  {
    id: "3",
    columnId: 2,
    content: {
      orderDate:'28-08-2023',
      customerName:'Alex',
      orderId: '00023'
    }
  },
  // {
  //   id: "3",
  //   columnId: "doing",
  //   content: "Conduct security testing",
  // },
  // {
  //   id: "4",
  //   columnId: "doing",
  //   content: "Analyze competitors",
  // },
  // {
  //   id: "5",
  //   columnId: "done",
  //   content: "Create UI kit documentation",
  // },
  // {
  //   id: "6",
  //   columnId: "done",
  //   content: "Dev meeting",
  // },
  // {
  //   id: "7",
  //   columnId: "done",
  //   content: "Deliver dashboard prototype",
  // },
  // {
  //   id: "8",
  //   columnId: "todo",
  //   content: "Optimize application performance",
  // },
  // {
  //   id: "9",
  //   columnId: "todo",
  //   content: "Implement data validation",
  // },
  // {
  //   id: "10",
  //   columnId: "todo",
  //   content: "Design database schema",
  // },
  // {
  //   id: "11",
  //   columnId: "todo",
  //   content: "Integrate SSL web certificates into workflow",
  // },
  // {
  //   id: "12",
  //   columnId: "doing",
  //   content: "Implement error logging and monitoring",
  // },
  // {
  //   id: "13",
  //   columnId: "doing",
  //   content: "Design and implement responsive UI",
  // },
];

function KanbanBoard() {
  const [columns, setColumns] = useState(Statuses);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  const [tasks, setTasks] = useState(defaultTasks);

  const [activeColumn, setActiveColumn] = useState(null);

  const [activeTask, setActiveTask] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  return (
    <div
      className="
      bg-black-color
        m-auto
        flex
        min-h-screen
        w-full
        items-center
        overflow-x-auto
        overflow-y-hidden
        px-[20px]
    "
    >
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="m-auto flex gap-4">
          <div className="flex gap-4">
            <SortableContext items={columnsId}>
              {columns.map((col) => (
                <ColumnContainer
                  key={col.id}
                  column={col}
                  // deleteColumn={deleteColumn}
                  // updateColumn={updateColumn}
                  createTask={createTask}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                  tasks={tasks.filter((task) => task.columnId === col.id)}
                />
              ))}
            </SortableContext>
          </div>
          {/* <button
            onClick={() => {
              createNewColumn();
            }}
            className="
                  h-[60px]
                  w-[250px]
                  min-w-[350px]
                  cursor-pointer
                  rounded-lg
                  
                  border-2
                  p-4
                  hover:ring-2
                  flex
                  gap-2
                  "
          >
            <PlusIcon />
            Add Column
          </button> */}
        </div>

        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                createTask={createTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
                tasks={tasks.filter(
                  (task) => task.columnId === activeColumn.id
                )}
              />
            )}
            {activeTask && (
              <TaskCard
                task={activeTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );

  function createTask(columnId) {
    const newTask = {
      id: generateId(),
      columnId,
      content: `Task ${tasks.length + 1}`,
    };

    setTasks([...tasks, newTask]);
  }

  function deleteTask(id) {
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
  }

  function updateTask(id, content) {
    const newTasks = tasks.map((task) => {
      if (task.id !== id) return task;
      return { ...task, content };
    });

    setTasks(newTasks);
  }

  function createNewColumn() {
    const columnToAdd = {
      id: generateId(),
      name: `Column ${columns.length + 1}`,
    };

    setColumns([...columns, columnToAdd]);
  }

  function deleteColumn(id) {
    const filteredColumns = columns.filter((col) => col.id !== id);
    setColumns(filteredColumns);

    const newTasks = tasks.filter((t) => t.columnId !== id);
    setTasks(newTasks);
  }

  function updateColumn(id, name) {
    const newColumns = columns.map((col) => {
      if (col.id !== id) return col;
      return { ...col, name };
    });

    setColumns(newColumns);
  }

  function onDragStart(event) {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }

    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  function onDragEnd(event) {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveAColumn = active.data.current?.type === "Column";
    if (!isActiveAColumn) return;

    console.log("DRAG END");

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex((col) => col.id === activeId);

      const overColumnIndex = columns.findIndex((col) => col.id === overId);

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  }

  function onDragOver(event) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    // Im dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        if (tasks[activeIndex].columnId != tasks[overIndex].columnId) {
          // Fix introduced after video recording
          tasks[activeIndex].columnId = tasks[overIndex].columnId;
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";

    // Im dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);

        tasks[activeIndex].columnId = overId;
        console.log("DROPPING TASK OVER COLUMN", { activeIndex });
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }
}

function generateId() {
  /* Generate a random number between 0 and 10000 */
  return Math.floor(Math.random() * 10001);
}

export default KanbanBoard;
