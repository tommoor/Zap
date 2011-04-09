/**
 * Zap! - HTML5 Sound Manager
 * Copyright (c) 2011 Tom Moor
 * MIT Licensed
 */

var Zap = (function() {

  var exports = {},
      sounds = {},
      groups = {},
      loaded = 0,
      timeout = 6*1000,
      self = this,
      options = {
          container: 'sounds',
          console: true,
          complete: function(){},
          error: function(){},
          update: function(){}
      };
  
  
  // supported audio formats
  exports.formats = {};
    
    
  /**
   * Initalise zap object, optionally include configs
   *
   * @param {Object} config object
   * @return {Zap} return itself to allow chaining
   */
   
  exports.init = function(opt){
  
      options = $.extend(options, opt);
      
      // create element to hold audio objects
      var container = document.createElement('div');
      container.setAttribute('id', options.container);
      document.body.appendChild(container);
      
      return this;
	}
	
	
	 
  /**
   * Allows sounds to be grouped under one reference, so that a random sound can be played
   *
   * @param {String} ref
   * @param {Array} an array of sound references
   * @return {Zap} return itself to allow chaining
   */
   
	exports.addGroup = function(ref, sounds){
	
	  groups[ref] = sounds;
	  return this;
	}
    
  
  /**
   * Add a sound to be played later
   *
   * @param {String} ref
   * @param {Array} sources
   * @param {Integer} maximum channels
   * @param {Integer} maximum ms loading before considered to have timed out
   * @return {Zap} return itself to allow chaining
   */
	
	exports.addSound = function(ref, sources, channels, time){
		
		var channels = channels || 1;
		var element = ref;
		
		// create reference to sound channels 
    sounds[ref] = {
        asset: '#' + ref,
        loaded: false,
        failed: false,
        duration: 0,
        channels: channels,
        channel: 0
    }
    
    // if a sound fails to load for any reason it shouldnt stop complete callback
    var loadTimeout = setTimeout(function(){
		
		    log('Zap: sound failed to load: ' + ref);
		    sounds[ref].failed = true;
            soundLoaded();
            options.error(ref);
		
		}, time || timeout);
        
		// create new wrapper to categorise channels
		$('<div/>', {
			'id': ref
		}).appendTo('#' + options.container);
		
		var c;
		// create an audio element for each channel
		while(channels--){
		
		    c = 'sound-' + element + '-' + channels;
		    
		    // create new channel
		    $('<audio/>', {
			    'id': c,
			    'preload': 'auto',
			    'autobuffer': true
		    }).appendTo('#' + ref);
		
		    // bind event handlers
		    $('#' + c).bind('canplaythrough', function(){
		        clearTimeout(loadTimeout);
                sounds[ref].loaded = true;
                sounds[ref].duration = $(this).get(0).duration*1000;
                soundLoaded();
            });
		
		    // add sound sources
		    for(var s in sources){
		        $('<source/>', {
			        'src': sources[s]
		        }).appendTo('#' + c);
		    }
		}
		
		log('Zap: sound added ' + ref);
		
		return this;
	}
	
	
	 /**
     * Play a sound by reference
     *
     * @param {String} ref
     * @param {Float} vol
     * @param {Integer} loops
     * @param {Function} callback
     * @return {Zap} return itself to allow chaining
     */
     
	exports.play = function(ref, vol, loops, c){

      // a group with this reference exists
      if(groups[ref]){
      
          // pick a random sample from this group
          var l = groups[ref].length-1;
          var r = Math.round(Math.random()*l);
          ref = groups[ref][r];
          
      } else if(! sounds[ref].loaded){
          log('Zap: sound with reference "' + ref + '" is not loaded');
          return false;
      }
      
      
      var callback = c || function(){};
      var volume = vol || 1;
	    var sound = sounds[ref];
	    var element = $('#sounds #' + ref + ' audio').get(sound.channel);
	    
	    log('Zap: playing "' + ref + '" on channel ' + (sound.channel+1));
	    
	    // circulate through the available channels
	    if(sound.channel++ >= sound.channels-1){
	        sound.channel = 0;
	    }
	    
	    // play one shot
	    element.currentTime = 0;
	    element.volume = volume;
	    element.play();
	    
	    if(loops){
	        // loop, if requested
          var count = 0;
	        var loopInterval = setInterval(function(){
	        
	            if(++count < loops){
	                Zap.play(ref, vol);
	                return true;
	            }
	            clearInterval(loopInterval);
	            callback();
	        }, sound.duration);
	        
	    } else {
	        // callback, if provided
	        setTimeout(callback, sound.duration);
	    }
	    
	    return this;
	}
	
	
	/**
     * Stop a sound by reference
     *
     * @param {String} ref
     * @return {Zap} return itself to allow chaining
     */

	exports.stop = function(ref){
	
	    // find all channels this sound could 
	    // be playing on and stop each one individually.
	    var element = $('#sounds #' + ref + ' audio').each(function(){
	    
	        $(this).get(0).pause();
	    });
	    
	    return this;
	}
	
	
	/**
     * Stop every sound that has been loaded
     *
     * @return {Zap} return itself to allow chaining
     */
	
	exports.stopAllSounds = function(){
	
	    $('#sounds audio').each(function(){
	    
	        $(this).get(0).pause();
	    });
	    
	    return this;
	}
	
	
	 /**
     * Utility method to find out format and codec support
     *
     * @return {Object} An object of possible codecs in the form 'format: boolean'
     */
	
	exports.supported = function(){
	
	    this.formats = {};
	    var a = document.createElement('audio');
	    
	    // MP3
        this.formats.mp3 = !!(a.canPlayType && a.canPlayType('audio/mpeg;').replace(/no/, ''));
        
        // Vorbis 
        this.formats.vorbis = !!(a.canPlayType && a.canPlayType('audio/ogg; codecs="vorbis"').replace(/no/, ''));
        
        // WAV
        this.formats.wav = !!(a.canPlayType && a.canPlayType('audio/wav; codecs="1"').replace(/no/, ''));
        
        // AAC
        this.formats.aac = !!(a.canPlayType && a.canPlayType('audio/mp4; codecs="mp4a.40.2"').replace(/no/, ''));
        
        return this.formats;
	}
	
	var getChannelCount = function(){
    
        var c = 0;
        for (var i in sounds) {
            c += sounds[i].channels;
        }
        
        return c;
    }
    
    var getPercentageLoaded = function(){
        return (loaded / getChannelCount())*100;
    }
    
    var soundLoaded = function(){
        loaded++;
        options.update( getPercentageLoaded() );
        
        if(loaded == getChannelCount()) options.complete();
    }
    
    var log = function(){ 
        if(window.console && options.console){ 
            window.console.log( Array.prototype.slice.call(arguments) ); 
        }
    }
	
	return exports;
})();

