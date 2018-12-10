$( document ).ready(function() {
  let x = 0
  let y = 0
  let s, d, f = false
  let spidermitesKilled = 0
  let spawnTime = 1000
  let finalScore = 0

  const personalRecord = localStorage.getItem('personalRecord') || 0

  const spiderColors = ['purple', 'red', 'blue']

  $('#personalRecord').html(`Personal Record: ${personalRecord}`)

  document.addEventListener('mouseover', destroySpider)

  document.getElementById('restartGame').addEventListener('click', function(e){
    console.log('click')
    spawnSpidermite = setInterval(createNewSpider, spawnTime)
  })

  document.getElementById('submitScore').addEventListener('click', function(e){
    console.log($('input').val());
    fetch('http://localhost:3000/scores/create', {
      method: 'POST',
      headers: {
          "Content-Type": "application/json; charset=utf-8",
          // "Content-Type": "application/x-www-form-urlencoded",
      },
      body: JSON.stringify({
        name: $('input').val(),
        score: finalScore
      })
    })
    .then(response => {response.json()})
    .then((body) => {
      $('#topScores').html('')
      appendTopScores()
    })
  })

  document.addEventListener('keydown', function(e){
    let target = e.key
    //scenarios of all keys down
    if((!s && !d && !f)){
      if(target === 's'){
        s = true
      }
      if(target === 'd'){
        d = true
      }
      if(target === 'f'){
        f = true
      }
    }
  })

  document.addEventListener('keyup', function(e){
    s = false
    d = false
    f = false
  })


  function appendTopScores(){
    fetch(`http://localhost:3000/`)
      .then(res => res.json())
      .then((body) => {
        // array of top scores, name, score, date
        body.map((score) => {
          return $('#topScores').append(`<li>${score.name}, ${score.score} spidermites killed.</li>`)
        })
      })
  }

  function checkSpidermtiesKilled(){
    if(spidermitesKilled%10 === 0){
      spawnTime -= 100
      clearInterval(spawnSpidermite)
      spawnSpidermite = setInterval(createNewSpider, spawnTime)
    }
  }

  function updateSpidermitesKilled(){
    $('#spidermitesKilled').html(`Spidermites Killed: ${spidermitesKilled}`)
  }

  function destroySpider(e){
    let target = e.target
    if(target.tagName === 'circle' && s === true && target.style.fill === 'red'){
      target.parentNode.removeChild(target)
      spidermitesKilled += 1
      checkSpidermtiesKilled()
      updateSpidermitesKilled()
    }
    if(target.tagName === 'circle' && d === true && target.style.fill === 'blue'){
      target.parentNode.removeChild(target)
      spidermitesKilled += 1
      checkSpidermtiesKilled()
      updateSpidermitesKilled()
    }
    if(target.tagName === 'circle' && f === true && target.style.fill === 'purple'){
      target.parentNode.removeChild(target)
      spidermitesKilled += 1
      checkSpidermtiesKilled()
      updateSpidermitesKilled()
    }
  }

  function checkSpiderLocation(){
    $('circle').each(function(){
      let xMin = window.innerWidth/2 - 55
      let xMax = window.innerWidth/2 +55
      let yMin = window.innerHeight/2 -55
      let yMax = window.innerHeight/2 +55
      let currentX = $(this)[0].getBoundingClientRect().x
      let currentY = $(this)[0].getBoundingClientRect().y
      if(((currentX >= xMin && currentX <= xMax) &&
        (currentY >= yMin && currentY <= yMax)) ||
        ((currentX >= xMin && currentX <= xMax) &&
          (currentY >= yMin && currentY <= yMax))
      ){
        restartGame()
      }
    })
  }

  function restartGame(){
    spidermitesKilled > personalRecord ?
    (localStorage.setItem('personalRecord', spidermitesKilled)):
    (null)
    finalScore = spidermitesKilled
    clearInterval(spawnSpidermite)
    d3.selectAll('circle').remove()
    $('#score').html(`<h1>Score: ${spidermitesKilled}</h1>`)
    appendTopScores()
    $('#endGameModal').click()
    spawnTime = 1500
    spidermitesKilled = 0
  }

  function generateCoordinates(){
    x = Math.ceil(Math.random() * 800);
    y = Math.ceil(Math.random() * 800);
    if((x <= 250 || x >= 550)){
      return [x, y]
    }else if((y <= 250 || y >= 550)){
      return [x, y]
    }else{
      generateCoordinates()
    }
  }

  function createNewSpider(){
    let coordinates = generateCoordinates()
    color = spiderColors[Math.floor(Math.random() * spiderColors.length)]
    var svg = d3.select('svg')
    spider = svg.append('circle')
      .attr('cx', coordinates[0])
      .attr('cy', coordinates[1])
      .attr('r', 10)
      .style("fill", color)
      .transition()
        .duration(1000)
        .attr("transform", `translate(${Math.ceil(Math.random() * 100)}, ${Math.ceil(Math.random() * 100)})scale(1)`)
      .transition()
        .duration(1000)
        .attr("transform", `translate(-${Math.ceil(Math.random() * 100)}, -${Math.ceil(Math.random() * 100)})scale(1)`)
      .transition()
        .duration(1000)
        .attr("transform", `translate(${Math.ceil(Math.random() * 100)}, ${Math.ceil(Math.random() * 100)})scale(1)`)
      .transition()
        .duration(5000)
        .attr("transform", `translate(${400-x},${400-y})scale(1)`)
  }

  function draw(){
    checkSpiderLocation()
    requestAnimationFrame(draw)
  }

  var spawnSpidermite = setInterval(createNewSpider, spawnTime)
  requestAnimationFrame(draw)

})
