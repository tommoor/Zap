# Zap! HTML 5 Game Audio 

Zap! is an audio manager for html 5 applications with a focus on real time uses such as games. 

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
            complete: function(){                        
                // callback for all sounds finished loading
            },
            error: function(ref){
                // callback when a sound fails to load
            },
            update: function(percent){
                // callback when a sound finishes loading
            }
        });



### addSound(ref, sources, channels, time)

Add a sound to be loaded, this method can be chained.

__Arguments__

* refs - A unique string reference for this sound
* sources - An array of possible sources in the order they should be checked
* channels - The maximum number of channels available for this sample
* time - Time to wait until giving up on the sound loading 

__Example__
        
        Zap.addSound('beat', ['beat.mp3', 'beat.ogg', 'beat.wav'])
           .addSound('laser', ['shoot.mp3', 'shoot.ogg'], 5);


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
