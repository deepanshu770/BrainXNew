import { AudioContext } from 'react-native-audio-api';

class AudioEngineService {
  private audioCtx: AudioContext | null = null;
  private gainNode: any = null;
  private oscillators: { left: any; right: any } | null = null;
  private isInitialized = false;

  constructor() {
    // Singleton
  }

  /**
   * Initialize the AudioContext and Audio Graph.
   * Should be called once on app startup.
   */
  initialize() {
    if (this.isInitialized && this.audioCtx) return;

    console.log('AudioEngine: Initializing...');
    this.audioCtx = new AudioContext();
    
    const oscLeft = this.audioCtx.createOscillator();
    const oscRight = this.audioCtx.createOscillator();
    const pannerLeft = this.audioCtx.createStereoPanner();
    const pannerRight = this.audioCtx.createStereoPanner();
    const mainGain = this.audioCtx.createGain();

    oscLeft.type = 'sine';
    oscRight.type = 'sine';

    // Initial dummy frequencies
    oscLeft.frequency.value = 440; 
    oscRight.frequency.value = 440;

    pannerLeft.pan.value = -1;
    pannerRight.pan.value = 1;
    mainGain.gain.value = 0.5;

    // Connect Graph
    oscLeft.connect(pannerLeft);
    pannerLeft.connect(mainGain);
    oscRight.connect(pannerRight);
    pannerRight.connect(mainGain);
    mainGain.connect(this.audioCtx.destination);

    this.gainNode = mainGain;
    this.oscillators = { left: oscLeft, right: oscRight };

    // Start oscillators immediately
    const now = this.audioCtx.currentTime;
    oscLeft.start(now);
    oscRight.start(now);
    
    // Immediately suspend so it doesn't play sound until requested
    this.audioCtx.suspend();

    this.isInitialized = true;
  }

  /**
   * Start or resume playback with specific frequencies.
   */
  async play(baseFreq: number, beatFreq: number) {
    if (!this.isInitialized) this.initialize();
    
    this.updateFrequency(baseFreq, beatFreq);
    
    if (this.audioCtx?.state === 'suspended') {
      await this.audioCtx.resume();
    }
  }

  /**
   * Pause/Suspend playback.
   */
  async pause() {
    if (this.audioCtx?.state === 'running') {
      await this.audioCtx.suspend();
    }
  }

  /**
   * Update frequencies dynamically while playing.
   */
  updateFrequency(baseFreq: number, beatFreq: number) {
    if (!this.audioCtx || !this.oscillators) return;

    const now = this.audioCtx.currentTime;
    try {
        // Smooth transition if supported
        this.oscillators.left.frequency.setValueAtTime(baseFreq, now);
        this.oscillators.right.frequency.setValueAtTime(baseFreq + beatFreq, now);
    } catch (e) {
        // Fallback
        this.oscillators.left.frequency.value = baseFreq;
        this.oscillators.right.frequency.value = baseFreq + beatFreq;
    }
  }

  /**
   * Get current context time
   */
  getCurrentTime() {
      return this.audioCtx?.currentTime || 0;
  }

  /**
   * Check if currently playing (running)
   */
  get isPlaying() {
      return this.audioCtx?.state === 'running';
  }
  
  /**
   * Resume context (helper)
   */
  async resume() {
      if (this.audioCtx?.state === 'suspended') {
          await this.audioCtx.resume();
      }
  }

  /**
   * Suspend context (helper)
   */
  async suspend() {
      if (this.audioCtx?.state === 'running') {
          await this.audioCtx.suspend();
      }
  }
}

export const AudioEngine = new AudioEngineService();
