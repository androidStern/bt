print = (x)-> console.log x

Dog = ->

  this.learnBark = (sound)->
    this.sound = sound

  this.bark = (sound) ->
    return

  return this

poo = new Dog()

print(poo)

boo = poo.learnBark(poo)

print(boo)
