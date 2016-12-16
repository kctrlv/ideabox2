$(document).ready(function(){
  handleCreateIdea();
  getIdeas();
})

// GET ALL IDEAS ON DOCUMENT READY
function getIdeas(){
 $.getJSON('/api/v1/ideas')
  .then ( renderIdeas )
}

// CREATE WITH AJAX
function createIdea(event) {
  event.preventDefault();
  var idea = { idea: {
      title:  $("#create-idea-title").val(),
      body: $("#create-idea-body").val() } }

  $.post("/api/v1/ideas", idea)
   .then( renderIdea )
   .then( clearIdeaFields )
}

// CLEAR FIELDS AFTER CREATING
function clearIdeaFields() {
$("#create-idea-title").val("");
$("#create-idea-body").val("");
}

// UPDATE WITH AJAX
function updateIdea(event) {
  var title = $(this).parent().find('.idea-title').text()
  var body  = $(this).parent().find('.idea-body').text()
  var id = $(this).parent().data('id')
  var idea = { idea: { title: title, body: body } }
  $.ajax({
    url: `/api/v1/ideas/${id}`,
    method: "PUT",
    data: idea
  })
}

// DELETE WITH AJAX
function deleteIdea(event) {
  var id = $(this).parent().data('id')
  $.ajax({
    url: "/api/v1/ideas/" + id,
    method: 'DELETE'
  })
  .then($(this).parent().remove());
}

// RENDERING IDEAS ON GETTING ALL AND CREATION
function renderIdeas(ideas) {
  ideas.forEach( renderIdea )
}

function renderIdea(idea) {
  var rawIdea =
    `<div class='idea' data-id='${idea.id}'>
    <div contenteditable="true" class='idea-title editable'>${idea.title}</div>
    <div contenteditable="true" class='idea-body editable'>${idea.body}</div>
    <p class='idea-quality'>${idea.quality}</p>
    <button type="button" name="delete-idea" class="delete-idea-button">Delete</button>
    </div>`

  $("#ideas-list").append(rawIdea)
  attachIdeaHandlers(idea);
}

// ATTACH HANDLERS ON NEWLY RENDERED IDEA
function attachIdeaHandlers(idea) {
  handleDeleteIdea(idea)
  handleUpdateIdea(idea)
}

// HANDLERS
function handleCreateIdea() {
  $("#create-idea-button").on('click', createIdea);
}

function handleDeleteIdea(idea) {
  $(`*[data-id=${idea.id}]`).find('.delete-idea-button').on('click', deleteIdea )
}

function handleUpdateIdea(idea) {
  $(`*[data-id=${idea.id}]`).find('.editable').on('focusout', updateIdea )
}
