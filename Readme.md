# Zap! HTML 5 Game Audio 

Zap! is an audio manager for html 5 applications with a focus on real-time uses such as games. 

It provides a common interface that works across the individual browser quirks and shortcomings such as multiple channels, looping and callbacks.

Zap! depends on jQuery 1.4+


## Documentation

### init(options)

Init should be run before anything else to setup configuration and create dom elements

__Arguments__

* options - Optional configuration object

__Example__

        Zap.init({
            console: true,
            container: 'sound-holder'
        });


### on(event, callback)

There are currently three events that can be bound using the 'on' function; 'success', 'update' and 'error'. 
Multiple callbacks may also be bound.

__Arguments__

* ref - An event (success, update or error)
* callback - A function to be called whenever the above event occurs

__Example__
        
        Zap.on('complete', function(){
          // all sounds are loaded
        });
        
        Zap.on('update', function(percent){
          // sounds are loading
        });
        
        Zap.on('error', function(ref){
          // there was a problem loading a sound file
        });
           
           

### addSound(ref, sources, channels, time)

Add a sound to be loaded, this method can be chained.

__Arguments__

* ref - A unique string reference for this sound
* sources - An array of possible sources in the order they should be checked
* channels - The maximum number of channels available for this sample
* time - Time to wait until giving up on the sound loading 

__Example__
        
        Zap.addSound('beat', ['beat.mp3', 'beat.ogg', 'beat.wav'])
           .addSound('laser', ['shoot.mp3', 'shoot.ogg'], 5);



### addGroup(ref, sounds)

Allows sounds to be added into groups, groups can then be played back like
individual sounds - a random sound from the group will be chosen. This method
can be chained.

__Arguments__

* ref - A unique string reference for this group
* sounds - An array of possible sound references

__Example__
        
        Zap.addGroup('punch', ['thud', 'pow', 'kablam']);
        
        Zap.addSound('thud', ['thud.mp3', 'thud.ogg']),
           .addSound('pow', ['pow.mp3', 'pow.ogg']),
           .addSound('kablam', ['kablam.mp3', 'kablam.ogg']);



### play(ref, volume, loops, callback)

Play a sound by reference, this method can be chained.

__Arguments__

* ref - The sound reference
* volume - A number between 0-1
* loops - The number of times the sample should loop
* callback - An optional callback to be run once the sample finishes 

__Example__
        
        Zap.play('mysound', 1, 10, function(){
        
            alert('My sound has finished');
        });

### stop(ref)

Stop a sound by reference, this method can be chained.

__Arguments__

* ref - The sound reference

__Example__
        
        Zap.stop('mysound');
        
### stopAllSounds

Stop every loaded sound

__Example__
        
        Zap.stopAllSounds();


### supported

Utility method to find out which formats and codecs are supported in the current browser

__Example__
        
        Zap.supported();


## Download

Releases are available for download from
[GitHub](http://github.com/tommoor/Zap/downloads).

__Development:__ [zap.js](https://github.com/tommoor/Zap/raw/master/Zap.js)

__Production:__ [zap.min.js](https://github.com/tommoor/Zap/raw/master/Zap.min.js)
