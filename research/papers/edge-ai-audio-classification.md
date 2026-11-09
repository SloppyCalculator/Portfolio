# Ultra-Low Latency Audio Classification on Edge Devices

**Author**: Umar Jamal, Uthum De Saram, Ayyub Rifkie, Johan Sofalas, 
**Venue**: NA  
**Focus**: Model Optimization, Quantization, Edge Computing  

---

## Abstract
Deploying deep convolutional neural networks for acoustic event detection on edge microarchitectures is bottlenecked by thermal constraints, limited SRAM, and strict latency requirements. We introduce an INT8 post-training quantization and structured filter pruning pipeline deployed on a Raspberry Pi 4 (Quad-Core Cortex-A72 @ 1.5GHz).

The optimized model reduces disk footprint from 48.2 MB to 11.4 MB (76.3% reduction) while maintaining 92.1% top-1 accuracy on environmental acoustic event benchmarks. End-to-end inference latency drops from 142 ms to 28 ms, enabling real-time edge audio event monitoring without external cloud telemetry.

---

## Technical Architecture
- **Backbone**: MobileNetV3-Small with modified 1D Spectrogram front-end
- **Pruning**: Structured $L_1$-norm channel pruning with iterative fine-tuning
- **Quantization**: INT8 Symmetric quantization via TFLite runtime
- **Deployment Platform**: Linux ARM64 (Debian 11), Broadcom BCM2711
