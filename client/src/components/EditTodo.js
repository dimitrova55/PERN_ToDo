import React, { Fragment, useState } from "react";

export const EditTodo = ({ todo }) => {

    const [description, setDescription] = useState(todo.description);

    async function updateDescription(e) {
        e.preventDefault();

        const body = { description };
        try {
            const response = await fetch(`http://localhost:5000/todos/${todo.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            console.log(response);
            window.location = "/"

        } catch (error) {
            console.log(error.message);
        }
    }

    return (
      <Fragment>
        <button
          type="button"
          class="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target={`#id${todo.id}`}
        >
          Edit
        </button>

        <div class="modal" id={`id${todo.id}`}>
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h4 class="modal-title">Edit todo</h4>
              </div>

              <div class="modal-body">
                <input
                  type="text"
                  className="form-control"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-warning"
                  data-bs-dismiss="modal"
                  onClick={(e) => updateDescription(e)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  class="btn btn-danger"
                  data-bs-dismiss="modal"
                  onClick={() => setDescription(todo.description)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
};