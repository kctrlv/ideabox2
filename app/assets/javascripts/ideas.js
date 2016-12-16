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

// QUALITY CHANGE WITH AJAX

function downvoteIdea(event) {
  changeQualityOfIdea(this, -1)
}

function upvoteIdea(event) {
  changeQualityOfIdea(this, 1)
}

function changeQualityOfIdea(obj, val) {
  var id = $(obj).closest('.idea').data('id')
  var quality = $(obj).closest('.idea').find('.idea-quality').text()
  var newQuality = calculateQuality(quality, val)
  $(obj).closest('.idea').find('.idea-quality').text(newQuality)
  if (quality != newQuality) {
    $.ajax({
      url: `/api/v1/ideas/${id}`,
      method: "PUT",
      data: { idea: { quality: newQuality } }
    })
  }
  
}

function calculateQuality(quality, val) {
  qualities = ['swill', 'meh', 'genius']
  newIndex = qualities.indexOf(quality) + val
  if (newIndex < 0) {
    return qualities[0]
  } else if (newIndex > qualities.length - 1) {
    return qualities[qualities.length - 1]
  } else {
    return qualities[newIndex]
  }
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
       <p class='quality-menu'>
          <span><button type="button" class="idea-quality-dn">-</button></span>
          <span class='idea-quality'>${idea.quality}</span>
          <span><button type="button" class="idea-quality-up">+</button></span>
       </p>
       <button type="button" name="delete-idea" class="delete-idea-button">Delete</button>
     </div>`

  $("#ideas-list").append(rawIdea)
  attachIdeaHandlers(idea);
}






// ATTACH HANDLERS ON NEWLY RENDERED IDEA
function attachIdeaHandlers(idea) {
  handleDeleteIdea(idea)
  handleUpdateIdea(idea)
  handleChangeQualityOfIdea(idea)
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

function handleChangeQualityOfIdea(idea) {
  $(`*[data-id=${idea.id}]`).find('.idea-quality-dn').on('click', downvoteIdea )
  $(`*[data-id=${idea.id}]`).find('.idea-quality-up').on('click', upvoteIdea )
}
