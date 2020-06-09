// KOMPONENT NIEKONTROLOWANY
// nr 1 za pomocą formRef
class TimeboxCreator extends React.Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
  }
  handleSubmit = (event) => {
    event.preventDefault();
    //console.log(this.formRef.current[0])
    if (
      this.formRef.current[0].value.length < 3 ||
      this.formRef.current[1].value <= 0
    )
      return;
    this.props.onCreate({
      id: uuid.v4(),
      title: this.formRef.current[0].value,
      totalTimeInMinutes: this.formRef.current[1].value,
    });
    this.formRef.current[0].value = "";
    this.formRef.current[1].value = "";
  };
  render() {
    const { isEditable } = this.props;
    return (
      <form
        onSubmit={this.handleSubmit}
        className={`TimeboxCreator ${!isEditable ? "" : "inactive"}`}
        ref={this.formRef}
      >
        <label>
          Co robisz?
          <input type="text" />
        </label>
        <br />
        <label>
          Ile minut?
          <input type="number" />
        </label>
        <br />
        <button>Dodaj Timebox</button>
      </form>
    );
  }
}
// nr 2 za pomocą form.elements
// class TimeboxCreator extends React.Component{

//   handleSubmit= e =>{
//     e.preventDefault();
//     if(form.elements[0].value.length <3 || !form.elements[1].value) return;
//     this.props.onCreate({id: uuid.v4(), title: form.elements[0].value, totalTimeInMinutes: form.elements[1].value});
//     form.elements[0].value = '';
//     form.elements[1].value = '';
//   }
//   render(){
//     const {isEditable} =this.props;
//     return(
//   <form onSubmit={this.handleSubmit} className={`TimeboxCreator ${!isEditable ? '' : 'inactive'}`} id="form">
//     <label>Co robisz?<input type="text" /></label><br />
//     <label>Ile minut?<input type="number"/></label><br />
//     <button>dodaj timebox</button>
//   </form>
//     )
//   }};

class TimeboxList extends React.Component {
  state = {
    isEditable: false,
    currentEditTimebox: null,
    timeboxes: [
      {
        id: "a",
        title: "uczę sie reacta",
        totalTimeInMinutes: 10,
      },
      {
        id: "b",
        title: "uczę sie laravela",
        totalTimeInMinutes: 23,
      },
      {
        id: "c",
        title: "uczę sie js es6",
        totalTimeInMinutes: 22,
      },
    ],
  };
  addTimebox = (createdTimebox) => {
    this.setState((prevState) => {
      const timeboxes = [createdTimebox, ...prevState.timeboxes]; // dodajemy element na początku tablicy
      return { timeboxes };
    });
  };
  handleCreate = (createdTimebox) => {
    this.addTimebox(createdTimebox);
  };
  handleDelete = ({ id }) => {
    this.setState((prevState) => ({
      timeboxes: prevState.timeboxes.filter((timebox) => timebox.id !== id),
    }));
  };
  handleEdit = (timebox) => {
    this.setState({
      timebox,
      currentEditTimebox: timebox.id,
      isEditable: true,
    });
  };
  cancelEdit = () => {
    this.setState({
      currentEditTimebox: null,
      isEditable: false,
    });
  };
  handleUpdate = (updatedTimebox) => {
    this.setState((prevState) => ({
      timeboxes: prevState.timeboxes.map((timebox) =>
        timebox.id === updatedTimebox.id ? updatedTimebox : timebox
      ),
      isEditable: false,
      currentEditTimebox: null,
    }));
  };
  render() {
    const { isEditable, timeboxes, currentEditTimebox } = this.state;
    return (
      <>
        <TimeboxCreator onCreate={this.handleCreate} isEditable={isEditable} />
        {this.state.timeboxes.map((timebox) => (
          <Timebox
            key={timebox.id}
            timebox={timebox}
            onDelete={() => this.handleDelete(timebox)}
            onUpdate={this.handleUpdate}
            onEdit={() => this.handleEdit(timebox)}
            isEditable={isEditable}
            currentEditTimebox={currentEditTimebox}
            cancelEdit={this.cancelEdit}
          />
        ))}
      </>
    );
  }
}

function Timebox({
  timebox,
  onDelete,
  onUpdate,
  onEdit,
  isEditable,
  currentEditTimebox,
  cancelEdit,
}) {
  const { id, title, totalTimeInMinutes } = timebox;
  return (
    <div className="Timebox">
      {currentEditTimebox !== id ? (
        <>
          <h3>
            {title} - {totalTimeInMinutes} min.
          </h3>
          <button disabled={isEditable} onClick={onDelete}>
            usuń
          </button>
          <button disabled={isEditable} onClick={onEdit}>
            zmień
          </button>
        </>
      ) : (
        <TimeboxEdition
          timebox={timebox}
          cancelEdit={cancelEdit}
          onUpdate={onUpdate}
        />
      )}
    </div>
  );
}

class TimeboxEdition extends React.Component {
  state = {
    title: this.props.timebox.title,
    totalTimeInMinutes: this.props.timebox.totalTimeInMinutes,
  };
  handleChange = (event) => {
    // console.log(event.target.value)
    this.setState({
      [event.target.name]: event.target.value,
    });
  };
  handleSubmitForm = (event) => {
    event.preventDefault();
    const { title, totalTimeInMinutes } = this.state;
    const { timebox, onUpdate } = this.props;
    if (title.length < 3 || totalTimeInMinutes <= 0) return;
    onUpdate({
      ...timebox,
      title,
      totalTimeInMinutes,
    });
  };

  render() {
    const { title, totalTimeInMinutes } = this.state;
    const { cancelEdit } = this.props;
    return (
      <form onSubmit={this.handleSubmitForm}>
        <input
          type="text"
          onChange={this.handleChange}
          value={title}
          name="title"
        />
        <input
          type="number"
          onChange={this.handleChange}
          value={totalTimeInMinutes}
          name="totalTimeInMinutes"
        />
        <button type="submit">edytuj</button>
        <button onClick={cancelEdit}>anuluj</button>
      </form>
    );
  }
}

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <TimeboxList />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
