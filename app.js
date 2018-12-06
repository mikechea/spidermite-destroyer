$( document ).ready(function() {

  let x = 0
  let y = 0
  let s, d, f = false

  const spiderColors = ['purple', 'red', 'blue']

  document.addEventListener('mouseover', destroySpider)

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

  function destroySpider(e){
    let target = e.target
    if(target.tagName === 'circle' && s === true && target.style.fill === 'red'){
      target.parentNode.removeChild(target)
    }
    if(target.tagName === 'circle' && d === true && target.style.fill === 'blue'){
      target.parentNode.removeChild(target)
    }
    if(target.tagName === 'circle' && f === true && target.style.fill === 'purple'){
      target.parentNode.removeChild(target)
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
        location.reload()
      }
    })
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
        .duration(5000)
        .attr("transform", `translate(${400-x},${400-y})scale(1)`)
  }

  function draw(){
    checkSpiderLocation()
    requestAnimationFrame(draw)
  }

  setInterval(createNewSpider, 1500)
  requestAnimationFrame(draw)

})
