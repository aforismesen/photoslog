Controller = require('controller')
View = require('view')
ImageView = require('imageView')
ratio = require('ratio')
config = require('config')

class Fullscreen extends Controller
  constructor: ->
    super

    @view = new View(className: 'fullscreenView')
    @view.css(visibility: 'hidden')
    @view.el.addEventListener('click', @onClick)

    @backgroundView = new View(className: 'backgroundView')
    @backgroundView.css(opacity: 0)
    @view.addSubview(@backgroundView)

    @imageView = null
    @originalView = null
    @hidden = true

  open: (image, options = {}) =>
    return unless @hidden
    @hidden = false
    @image = image
    filePath = image.files[ratio]
    @imageView = new ImageView(
      imagePath: config.imagesRootPath + filePath,
      object: image
    )

    @originalView = options.view
    frame = @originalView.screenFrame()
    @imageView.css(
      left: frame.x,
      top: frame.y,
      width: frame.width,
      height: frame.height,
      scaleX: 1,
      scaleY: 1
    )

    @imageView.load =>
      @view.addSubview(@imageView)
      @view.css(visibility: 'visible')

      @backgroundView.animate({
        opacity: 1
      }, {
        type: dynamics.EaseInOut,
        duration: 200
      })

      @imageView.animate({
        left: 0,
        top: 0,
        width: @view.width(),
        height: @view.height()
      }, {
        type: dynamics.Spring,
        frequency: 10,
        friction: 500,
        anticipationStrength: 0,
        anticipationSize: 0,
        duration: 1000
      })

      window.addEventListener('resize', @layout)
      window.addEventListener('keydown', @onKeyDown)

  slide: (image, options={}) =>
    return if @hidden

    oldImageView = @imageView

    @image = image
    filePath = image.files[ratio]
    @originalView = options.view
    @imageView = new ImageView(
      imagePath: config.imagesRootPath + filePath,
      object: image
    )
    @imageView.css({
      left: 0,
      top: 0,
      width: @view.width(),
      height: @view.height()
    })
    @imageView.load =>
      oldImageView.removeFromSuperview()
      @view.addSubview(@imageView)

  layout: =>
    @imageView.css({
      width: @view.width(),
      height: @view.height()
    })

  close: =>
    window.removeEventListener('resize', @layout)
    window.removeEventListener('keydown', @onKeyDown)

    frame = @originalView.screenFrame()
    @imageView.animate({
      left: frame.x,
      top: frame.y,
      width: frame.width,
      height: frame.height
    }, {
      type: dynamics.EaseInOut,
      duration: 300,
      complete: =>
        @imageView.removeFromSuperview()
        @view.css(visibility: 'hidden')
        @hidden = true
    })

    @backgroundView.animate({
      opacity: 0
    }, {
      type: dynamics.EaseInOut,
      duration: 200
    })

  previous: =>
    o = @delegate?.previousImage(@image)
    @slide(o.image, o.options)

  next: =>
    o = @delegate?.nextImage(@image)
    @slide(o.image, o.options)

  # Events
  onClick: =>
    @close()

  onKeyDown: (e) =>
    if e.keyCode == 27 or e.keyCode == 32
      @close()
      e.preventDefault()
      e.stopPropagation()
    else if e.keyCode == 39 or e.keyCode == 40
      @next()
      e.preventDefault()
      e.stopPropagation()
    else if e.keyCode == 37 or e.keyCode == 38
      @previous()
      e.preventDefault()
      e.stopPropagation()

module.exports = Fullscreen
