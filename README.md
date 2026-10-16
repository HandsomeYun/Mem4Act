<p align="center">
  <img src="docs/img/logo-sm.png" alt="Mem4Act logo" height="80">
</p>

<h1 align="center">Mem4Act</h1>

<p align="center"><b>Learning Effective Latent Memory for Long-Horizon Robotic Manipulation</b></p>

<p align="center">
  <a href="https://handsomeyun.github.io/">Yun Zhang</a><sup>1</sup>,
  <a href="https://mczhi.github.io/">Zhiyu Huang</a><sup>1,2,†</sup>,
  <a href="https://vickycth.github.io/">Tianhui Cai</a><sup>1</sup>,
  <a href="https://chentangmark.github.io/">Chen Tang</a><sup>1</sup>,
  <a href="https://web.cs.ucla.edu/~weiwang/">Wei Wang</a><sup>1</sup>,
  <a href="https://samueli.ucla.edu/people/jiaqi-ma/">Jiaqi Ma</a><sup>1</sup>
  <br>
  <sup>1</sup>University of California, Los Angeles &nbsp;&nbsp; <sup>2</sup>North Carolina State University
  <br>
  <sup>†</sup>Project leader. Corresponding author.
</p>

<p align="center">
  <a href="https://handsomeyun.github.io/Mem4Act/"><img src="https://img.shields.io/badge/Website-Mem4Act-e8603f?style=flat&logo=googlechrome&logoColor=white" alt="Website"></a>
  <a href="https://arxiv.org/abs/2610.22323"><img src="https://img.shields.io/badge/arXiv-2610.22323-b31b1b.svg?style=flat&logo=arxiv&logoColor=white" alt="arXiv"></a>
  <img src="https://img.shields.io/badge/Dataset-Coming%20Soon-f5c33b.svg?style=flat" alt="Dataset: coming soon">
</p>

<p align="center">
  <img src="docs/img/overview.png" alt="Mem4Act overview" width="100%">
</p>

## Overview

Most vision-language-action (VLA) policies act from the current frame alone, but long-horizon manipulation depends on what the robot saw earlier. **Mem4Act** distills past observations into a compact, **fixed-size latent memory** trained explicitly for control. It answers three questions:

| | Question | Mem4Act's answer |
|---|---|---|
| 🧠 **Coverage** | Where to attend? | Multi-granularity temporal attention spreads a fixed memory budget across time scales |
| 🧩 **Content** | What to retain? | Semantic QA and key-frame DINO feature reconstruction keep task facts and fine visual detail |
| 🎯 **Utilization** | How does the policy use it? | Memory-first two-stage training makes the policy rely on history, not just the current frame |

<p align="center">
  <img src="docs/img/framework.png" alt="Mem4Act framework" width="100%">
</p>

## Results

Evaluated on **29 tasks**, Mem4Act sets a new state of the art for memory-dependent control while keeping a fixed 512-token memory interface.

| Benchmark | Tasks | Best baseline | **Mem4Act** |
|---|:---:|:---:|:---:|
| RoboMME | 16 | 44.51 (FrameSamp+Modul) | **49.88** |
| RMBench | 9 | 48.7 (NativeMEM) | **61.0** |
| Real world | 4 | 42.50 (GPT-6 Astra) | **81.50** |

<sub>Success rate (%). See the <a href="https://arxiv.org/abs/2610.22323">paper</a> for all baselines and ablations, and the <a href="https://handsomeyun.github.io/Mem4Act/">website</a> for rollout videos.</sub>

## Citation

```bibtex
@misc{zhang2026mem4act,
  title         = {Mem4Act: Learning Effective Latent Memory for Long-Horizon Robotic Manipulation},
  author        = {Yun Zhang and Zhiyu Huang and Tianhui Cai and Chen Tang and Wei Wang and Jiaqi Ma},
  year          = {2026},
  eprint        = {2610.22323},
  archivePrefix = {arXiv},
  primaryClass  = {cs.RO},
  url           = {https://arxiv.org/abs/2610.22323}
}
```
