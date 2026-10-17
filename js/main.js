/**
 * WAQAS - SENIOR DEVOPS & CLOUD ARCHITECT PORTFOLIO
 * High-performance interactive animations & simulations
 */

document.addEventListener('DOMContentLoaded', () => {
  initNetworkCanvas();
  initNavbar();
  initPipelineSimulator();
  initInteractiveTerminal();
  initProjectFilters();
  initProjectModal();
  initSkillMatrix();
  initAudioSystem();
  initContactInteractions();
});

/* ===================================================================
   1. AMBIENT INTERACTIVE CLOUD NETWORK CANVAS
   Simulates cloud nodes, VPC peering, and moving data packets
   =================================================================== */
function initNetworkCanvas() {
  const canvas = document.getElementById('network-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height;
  let nodes = [];
  let packets = [];
  const mouse = { x: -1000, y: -1000, radius: 150 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createNodes();
  }

  function createNodes() {
    nodes = [];
    // Number of nodes based on screen width
    const count = Math.floor((width * height) / 22000);
    const nodeCount = Math.max(35, Math.min(count, 85));

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 2.2 + 1.2,
        color: Math.random() > 0.3 ? '#00f2fe' : (Math.random() > 0.5 ? '#10b981' : '#a855f7'),
        alpha: Math.random() * 0.5 + 0.3
      });
    }
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  // Spawn data packets along edges
  setInterval(() => {
    if (nodes.length < 2 || packets.length > 25) return;
    const a = nodes[Math.floor(Math.random() * nodes.length)];
    const nearby = nodes.filter(b => b !== a && Math.hypot(a.x - b.x, a.y - b.y) < 140);
    if (nearby.length > 0) {
      const b = nearby[Math.floor(Math.random() * nearby.length)];
      packets.push({
        startX: a.x, startY: a.y,
        endX: b.x, endY: b.y,
        progress: 0,
        speed: 0.015 + Math.random() * 0.02,
        color: Math.random() > 0.5 ? '#00f2fe' : '#10b981'
      });
    }
  }, 350);

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Update & draw nodes
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      n.x += n.vx;
      n.y += n.vy;

      if (n.x < 0 || n.x > width) n.vx *= -1;
      if (n.y < 0 || n.y > height) n.vy *= -1;

      // Mouse gentle repulsion
      const distMouse = Math.hypot(n.x - mouse.x, n.y - mouse.y);
      if (distMouse < mouse.radius) {
        const force = (mouse.radius - distMouse) / mouse.radius;
        const angle = Math.atan2(n.y - mouse.y, n.x - mouse.x);
        n.x += Math.cos(angle) * force * 1.5;
        n.y += Math.sin(angle) * force * 1.5;
      }

      ctx.beginPath();
      ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
      ctx.fillStyle = n.color;
      ctx.globalAlpha = n.alpha;
      ctx.shadowBlur = 10;
      ctx.shadowColor = n.color;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;

      // Connect nearby nodes
      for (let j = i + 1; j < nodes.length; j++) {
        const n2 = nodes[j];
        const dist = Math.hypot(n.x - n2.x, n.y - n2.y);
        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(n2.x, n2.y);
          ctx.strokeStyle = '#00f2fe';
          ctx.globalAlpha = (1 - dist / 130) * 0.22;
          ctx.lineWidth = 0.8;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }

    // Update & draw moving packets
    for (let i = packets.length - 1; i >= 0; i--) {
      const p = packets[i];
      p.progress += p.speed;
      if (p.progress >= 1) {
        packets.splice(i, 1);
        continue;
      }

      const currentX = p.startX + (p.endX - p.startX) * p.progress;
      const currentY = p.startY + (p.endY - p.startY) * p.progress;

      ctx.beginPath();
      ctx.arc(currentX, currentY, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 12;
      ctx.shadowColor = p.color;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    requestAnimationFrame(animate);
  }

  resize();
  animate();
}

/* ===================================================================
   2. NAVBAR & SCROLL SPY
   =================================================================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  const links = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    highlightCurrentSection();
  });

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const isOpen = navLinks.classList.contains('open');
      mobileToggle.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
    });

    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        mobileToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
      });
    });
  }

  function highlightCurrentSection() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const targetLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

      if (targetLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          targetLink.classList.add('active');
        } else {
          targetLink.classList.remove('active');
        }
      }
    });
  }
}

/* ===================================================================
   3. INTERACTIVE LIVE CI/CD PIPELINE SIMULATOR
   Users can trigger, pause, or step through a real DevSecOps pipeline
   =================================================================== */
function initPipelineSimulator() {
  const triggerBtn = document.getElementById('pipeline-trigger-btn');
  const resetBtn = document.getElementById('pipeline-reset-btn');
  const progressLine = document.querySelector('.pipeline-progress-line');
  const stageNodes = document.querySelectorAll('.stage-node');
  const consoleBody = document.getElementById('pipeline-console-body');

  let currentStageIndex = -1;
  let isRunning = false;
  let pipelineTimer = null;

  const stageLogs = [
    {
      title: "Source Code Commit",
      logs: [
        "Commit verified: [a8f903e] 'feat: automated blue-green deployment policy'",
        "Git Hook: Branch protection policy passed on main",
        "Webhook triggered: GitHub Actions runner #4928 online"
      ]
    },
    {
      title: "Static Security & SAST",
      logs: [
        "SonarQube static code analysis starting...",
        "Trivy container & filesystem vulnerability scan: 0 Critical, 0 High",
        "HashiCorp Vault secret scan passed: No plain-text tokens detected"
      ]
    },
    {
      title: "Docker Container Build",
      logs: [
        "Multi-stage Dockerfile build initiated (alpine:3.19)",
        "Layer caching optimization applied: 8/9 layers cached",
        "Image tagged: registry.waqas-cloud.internal/app:v2.4.0 (Digest: sha256:d8c...)"
      ]
    },
    {
      title: "Automated Integration Tests",
      logs: [
        "Executing pytest suite: 145/145 unit tests passed (0.84s)",
        "End-to-End API contract verification: 100% successful",
        "Code coverage maintained at 94.8%"
      ]
    },
    {
      title: "Kubernetes Cloud Deployment",
      logs: [
        "ArgoCD controller received sync event for target cluster",
        "K8s RollingUpdate rollout started: Deployment/app-gateway",
        "3/3 pods scheduled to node-pool-prod-us-east-1a"
      ]
    },
    {
      title: "Health & Telemetry Verification",
      logs: [
        "Liveness and readiness probes returning HTTP 200 OK",
        "Prometheus latency metrics: 18ms p99 (Within SLA limit < 50ms)",
        "Pipeline executed successfully with ZERO downtime!"
      ]
    }
  ];

  function appendLog(text, tag = "INFO", isSuccess = false) {
    if (!consoleBody) return;
    const time = new Date().toLocaleTimeString('en-US', { hour12: false });
    const logItem = document.createElement('div');
    logItem.className = 'log-line';
    logItem.innerHTML = `
      <span class="log-time">[${time}]</span>
      <span class="log-tag ${isSuccess ? 'success' : 'info'}">[${tag}]</span>
      <span class="log-msg">${text}</span>
    `;
    consoleBody.appendChild(logItem);
    consoleBody.scrollTop = consoleBody.scrollHeight;
  }

  function runStage(index) {
    if (index >= stageNodes.length) {
      isRunning = false;
      if (triggerBtn) {
        triggerBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Build Succeeded';
        triggerBtn.classList.add('btn-emerald');
      }
      playSynthesizedSound('success');
      appendLog("🎉 Complete CI/CD Pipeline cycle finished successfully!", "SUCCESS", true);
      return;
    }

    currentStageIndex = index;
    const node = stageNodes[index];
    node.classList.remove('success');
    node.classList.add('active');

    // Update progress line percentage
    if (progressLine) {
      const percentage = (index / (stageNodes.length - 1)) * 100;
      progressLine.style.width = `${percentage}%`;
    }

    playSynthesizedSound('click');
    const stageData = stageLogs[index];
    appendLog(`Entering stage [${index + 1}/${stageNodes.length}]: ${stageData.title}`, "PIPELINE");

    stageData.logs.forEach((logText, lIndex) => {
      setTimeout(() => {
        appendLog(logText, "BUILD");
      }, 350 * (lIndex + 1));
    });

    pipelineTimer = setTimeout(() => {
      node.classList.remove('active');
      node.classList.add('success');
      runStage(index + 1);
    }, 1700);
  }

  function resetPipeline() {
    clearTimeout(pipelineTimer);
    isRunning = false;
    currentStageIndex = -1;
    if (progressLine) progressLine.style.width = '0%';
    stageNodes.forEach(node => {
      node.classList.remove('active', 'success');
    });
    if (triggerBtn) {
      triggerBtn.innerHTML = '<i class="fa-solid fa-play"></i> Trigger Pipeline Build';
      triggerBtn.classList.remove('btn-emerald');
    }
    if (consoleBody) {
      consoleBody.innerHTML = `
        <div class="log-line">
          <span class="log-time">[SYSTEM]</span>
          <span class="log-tag info">[READY]</span>
          <span class="log-msg">Pipeline engine idle. Waiting for build trigger or commit hook...</span>
        </div>
      `;
    }
  }

  if (triggerBtn) {
    triggerBtn.addEventListener('click', () => {
      if (isRunning) return;
      resetPipeline();
      isRunning = true;
      triggerBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Running Pipeline...';
      runStage(0);
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', resetPipeline);
  }

  // Click on individual stage node to inspect
  stageNodes.forEach((node, idx) => {
    node.addEventListener('click', () => {
      playSynthesizedSound('click');
      appendLog(`Inspecting stage config: ${stageLogs[idx].title}`, "INSPECT");
    });
  });
}

/* ===================================================================
   4. INTERACTIVE DEVOPS TERMINAL CLI
   Realistic in-browser CLI for visiting engineers and recruiters
   =================================================================== */
function initInteractiveTerminal() {
  const termInput = document.getElementById('terminal-cli-input');
  const termScreen = document.getElementById('terminal-screen');
  const cmdPills = document.querySelectorAll('.cmd-pill');
  if (!termInput || !termScreen) return;

  const history = [];
  let historyIdx = -1;

  const commands = {
    help: () => `
<span class="gradient-text">Available Commands:</span>
  <span style="color: #00f2fe;">whoami</span>      - Overview of Waqas & professional profile
  <span style="color: #00f2fe;">skills</span>      - Technical stack & cloud proficiencies
  <span style="color: #00f2fe;">projects</span>    - Featured DevOps & cloud infrastructure projects
  <span style="color: #00f2fe;">deploy</span>      - Run simulated cloud cluster deployment
  <span style="color: #00f2fe;">status</span>      - Live cluster nodes & telemetry metrics
  <span style="color: #00f2fe;">certs</span>       - Cloud & DevOps certifications
  <span style="color: #00f2fe;">contact</span>     - How to reach Waqas for opportunities
  <span style="color: #00f2fe;">clear</span>       - Clear terminal window
  <span style="color: #00f2fe;">uptime</span>      - Real-time SLA and cluster runtime`,

    whoami: () => `
<strong style="color: #fff;">Waqas Ali</strong> - Senior DevOps & Cloud Infrastructure Engineer
-------------------------------------------------------------
Location:    Global / Remote
Specialty:   Kubernetes Orchestration, GitOps, IaC (Terraform), DevSecOps CI/CD
Passionate:  Eliminating manual toil, high-availability zero-downtime rollouts,
             and building bulletproof self-healing cloud platforms.
Status:      🟢 Open to Senior DevOps / Cloud Architect roles & Consulting.`,

    skills: () => `
<span style="color: #00f2fe;">CORE EXPERTISE & CLOUD STACK:</span>
  • <strong>Cloud Providers:</strong> AWS (EKS, VPC, IAM, RDS, S3), Azure (AKS), GCP
  • <strong>Containerization:</strong> Kubernetes, Docker, Helm, Istio Service Mesh
  • <strong>Infrastructure as Code:</strong> Terraform, Ansible, Terragrunt
  • <strong>CI/CD & GitOps:</strong> GitHub Actions, GitLab CI, ArgoCD, Flux
  • <strong>Observability:</strong> Prometheus, Grafana, OpenTelemetry, ELK, Datadog
  • <strong>Security (DevSecOps):</strong> SonarQube, Trivy, HashiCorp Vault, Falco
  • <strong>Scripting:</strong> Bash, Python, Go, Shell`,

    projects: () => `
<span style="color: #00f2fe;">PRODUCTION ARCHITECTURES:</span>
  [1] Multi-Region Kubernetes GitOps Mesh (ArgoCD + EKS)
  [2] DevSecOps Zero-Downtime Blue/Green CI/CD Pipeline
  [3] Enterprise Observability & Telemetry Command Center
  [4] Automated Multi-Cloud Infrastructure with Terraform
  Type or click <span style="color:#00f2fe;">status</span> or scroll down to view deep-dive architecture specs!`,

    deploy: () => {
      setTimeout(() => {
        printLine(`[Kube-Deploy] Rolling update: deployment.apps/core-api updated -> 100% available`);
      }, 700);
      return `<span style="color:#10b981;">[Triggered]</span> Authenticating to EKS cluster... Rolling out latest container image v2.4.0...`;
    },

    status: () => `
<span style="color: #10b981;">● CLUSTER HEALTH: OPTIMAL (ALL SYSTEMS GO)</span>
  • Cluster:           prod-us-east-1-k8s
  • Node Pools:        18 Nodes (Auto-scaling enabled)
  • Active Pods:       142 Pods running (0 CrashLoopBackOff)
  • CPU Utilization:   28.4%
  • Memory Usage:      46.2%
  • Average Latency:   18.2ms
  • SLA Uptime:        99.99%`,

    certs: () => `
<span style="color: #00f2fe;">VERIFIED CERTIFICATIONS:</span>
  🏆 AWS Certified Solutions Architect - Professional
  🏆 CKA: Certified Kubernetes Administrator (Cloud Native Computing Foundation)
  🏆 HashiCorp Certified: Terraform Associate
  🏆 Linux Foundation Certified System Administrator (LFCS)`,

    contact: () => `
<span style="color: #00f2fe;">GET IN TOUCH WITH WAQAS:</span>
  • Email:    <a href="mailto:contact.waqasdevops@gmail.com" style="color:#00f2fe;">contact.waqasdevops@gmail.com</a>
  • LinkedIn: <a href="https://linkedin.com" target="_blank" style="color:#00f2fe;">linkedin.com/in/waqas-devops</a>
  • GitHub:   <a href="https://github.com" target="_blank" style="color:#00f2fe;">github.com/waqas-devops</a>
  • Discord:  waqas_devops#9901`,

    uptime: () => `
Cluster running for 428 days, 14 hours, 22 mins with 99.99% availability.
Zero unplanned outages in the last 12 rolling months.`,

    clear: () => {
      termScreen.innerHTML = '';
      return '';
    }
  };

  function printLine(html) {
    const div = document.createElement('div');
    div.className = 'term-line';
    div.innerHTML = html;
    termScreen.appendChild(div);
    termScreen.scrollTop = termScreen.scrollHeight;
  }

  function handleCommand(cmdRaw) {
    const cmd = cmdRaw.trim().toLowerCase();
    if (!cmd) return;

    history.push(cmdRaw);
    historyIdx = history.length;

    printLine(`<span class="term-prompt">waqas@devops-cluster:~$</span> <span class="term-cmd">${escapeHtml(cmdRaw)}</span>`);

    if (commands[cmd]) {
      const output = commands[cmd]();
      if (output) {
        printLine(`<div class="term-output">${output}</div>`);
      }
    } else {
      printLine(`<div class="term-output" style="color: #ef4444;">command not found: "${escapeHtml(cmdRaw)}". Type <span style="color: #00f2fe;">help</span> to see available commands.</div>`);
    }

    playSynthesizedSound('click');
  }

  termInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = termInput.value;
      termInput.value = '';
      handleCommand(val);
    } else if (e.key === 'ArrowUp') {
      if (historyIdx > 0) {
        historyIdx--;
        termInput.value = history[historyIdx] || '';
      }
    } else if (e.key === 'ArrowDown') {
      if (historyIdx < history.length - 1) {
        historyIdx++;
        termInput.value = history[historyIdx] || '';
      } else {
        historyIdx = history.length;
        termInput.value = '';
      }
    }
  });

  // Suggestion tags click
  cmdPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const cmd = pill.getAttribute('data-cmd') || pill.innerText.trim();
      termInput.value = cmd;
      termInput.focus();
      handleCommand(cmd);
    });
  });

  function escapeHtml(text) {
    const m = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return text.replace(/[&<>"']/g, (match) => m[match]);
  }
}

/* ===================================================================
   5. PROJECT FILTER SYSTEM
   =================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      projectCards.forEach(card => {
        const category = card.getAttribute('data-category') || '';
        if (filter === 'all' || category.includes(filter)) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease-out forwards';
        } else {
          card.style.display = 'none';
        }
      });

      playSynthesizedSound('click');
    });
  });
}

/* ===================================================================
   6. PROJECT ARCHITECTURE DEEP-DIVE MODAL
   =================================================================== */
function initProjectModal() {
  const modalOverlay = document.getElementById('project-modal');
  const modalClose = document.getElementById('modal-close');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body-content');
  const modalButtons = document.querySelectorAll('.btn-project-modal');

  const projectDetails = {
    'k8s-mesh': {
      title: "Multi-Region Kubernetes GitOps Architecture",
      body: `
        <p style="color:#cbd5e1; margin-bottom: 1rem;">
          Architected and deployed an enterprise multi-region Kubernetes infrastructure spanning US-East, US-West, and EU-Central with automated GitOps synchronization via ArgoCD and Cilium eBPF Service Mesh.
        </p>
        <h4 style="color:#00f2fe; margin: 1.2rem 0 0.5rem;">Infrastructure Highlights</h4>
        <ul style="color:#94a3b8; padding-left: 1.2rem; line-height: 1.8;">
          <li>Automated zero-touch provisioning of EKS node pools via Terraform & Terragrunt.</li>
          <li>GitOps declarative repository syncing with automated rollback on health probe failures.</li>
          <li>Global Anycast DNS load balancing with sub-25ms cross-region failover.</li>
          <li>Strict mTLS mutual authentication across microservices via Cilium service mesh.</li>
        </ul>
        <h4 style="color:#00f2fe; margin: 1.2rem 0 0.5rem;">Declarative ArgoCD Application Spec (YAML)</h4>
        <div class="modal-yaml-block">apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: multi-region-core-mesh
  namespace: argocd
spec:
  project: production
  source:
    repoURL: 'https://github.com/waqas-devops/k8s-gitops-infra.git'
    targetRevision: HEAD
    path: clusters/prod-multi-region
  destination:
    server: 'https://kubernetes.default.svc'
    namespace: production
  syncPolicy:
    automated:
      prune: true
      selfHeal: true</div>
      `
    },
    'cicd-sec': {
      title: "DevSecOps Zero-Downtime Blue/Green CI/CD Pipeline",
      body: `
        <p style="color:#cbd5e1; margin-bottom: 1rem;">
          Engineered an end-to-end automated deployment pipeline integrating security scanning (SAST/DAST), multi-stage Docker builds, and zero-downtime Blue/Green traffic switching.
        </p>
        <h4 style="color:#00f2fe; margin: 1.2rem 0 0.5rem;">Pipeline Key Achievements</h4>
        <ul style="color:#94a3b8; padding-left: 1.2rem; line-height: 1.8;">
          <li>Reduced build & release cycle from 45 minutes to 4.2 minutes using layer caching.</li>
          <li>Eliminated 100% of production deployment downtime via canary & blue/green rollouts.</li>
          <li>Embedded automated vulnerability gating with Trivy and SonarQube in PR workflows.</li>
          <li>Automated Slack and PagerDuty notifications with detailed trace IDs on failure.</li>
        </ul>
        <h4 style="color:#00f2fe; margin: 1.2rem 0 0.5rem;">GitHub Actions Workflow Snippet</h4>
        <div class="modal-yaml-block">name: DevSecOps Production Deployment
on:
  push:
    branches: [ main ]
jobs:
  security-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Trivy Security Vulnerability Scanner
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          severity: 'CRITICAL,HIGH'
      - name: Blue-Green Kubernetes Rollout
        run: ./scripts/k8s-traffic-shift.sh --target=green --weight=100</div>
      `
    },
    'observability': {
      title: "Enterprise Cloud Observability & Telemetry Command Center",
      body: `
        <p style="color:#cbd5e1; margin-bottom: 1rem;">
          Centralized full-stack telemetry and distributed tracing across 200+ microservices using Prometheus, Grafana, OpenTelemetry, and Loki with automated alerting rules.
        </p>
        <h4 style="color:#00f2fe; margin: 1.2rem 0 0.5rem;">Telemetry Metrics & Impact</h4>
        <ul style="color:#94a3b8; padding-left: 1.2rem; line-height: 1.8;">
          <li>Achieved Mean Time To Resolution (MTTR) reduction from 48 minutes down to 6.5 minutes.</li>
          <li>Distributed trace visualization identifying query bottlenecks and 99th-percentile tail latency.</li>
          <li>Custom Grafana executive dashboards for infrastructure spend, error budgets, and SLOs.</li>
          <li>Dynamic auto-remediation scripts that recycle unresponsive pods automatically.</li>
        </ul>
        <h4 style="color:#00f2fe; margin: 1.2rem 0 0.5rem;">Prometheus AlertRule Configuration</h4>
        <div class="modal-yaml-block">groups:
- name: cluster-slo-alerts
  rules:
  - alert: HighRequestLatencyP99
    expr: histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket[5m])) by (le)) > 0.05
    for: 2m
    labels:
      severity: warning
    annotations:
      summary: High p99 Latency detected on gateway
      description: Latency has exceeded 50ms SLA for more than 2 minutes.</div>
      `
    }
  };

  modalButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projId = btn.getAttribute('data-project');
      const data = projectDetails[projId];
      if (data && modalTitle && modalBody) {
        modalTitle.innerText = data.title;
        modalBody.innerHTML = data.body;
        modalOverlay.classList.add('open');
        playSynthesizedSound('modal');
      }
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', () => {
      modalOverlay.classList.remove('open');
    });
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('open');
      }
    });
  }
}

/* ===================================================================
   7. SKILLS MATRIX TABS & ANIMATIONS
   =================================================================== */
function initSkillMatrix() {
  const tabs = document.querySelectorAll('.skill-tab-btn');
  const cards = document.querySelectorAll('.skill-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const cat = tab.getAttribute('data-cat');
      cards.forEach(card => {
        const cardCat = card.getAttribute('data-cat') || '';
        if (cat === 'all' || cardCat === cat) {
          card.style.display = 'block';
          card.style.animation = 'fadeIn 0.3s ease-out forwards';
        } else {
          card.style.display = 'none';
        }
      });
      playSynthesizedSound('click');
    });
  });
}

/* ===================================================================
   8. SYNTHESIZED AUDIO SYSTEM (WEB AUDIO API)
   Generates futuristic cyber feedback without external sound files
   =================================================================== */
let audioContext = null;
let soundEnabled = true;

function initAudioSystem() {
  const soundToggle = document.getElementById('sound-toggle-btn');

  if (soundToggle) {
    soundToggle.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      soundToggle.innerHTML = soundEnabled 
        ? '<i class="fa-solid fa-volume-high"></i> SFX: ON'
        : '<i class="fa-solid fa-volume-xmark"></i> SFX: OFF';
      soundToggle.style.color = soundEnabled ? '#00f2fe' : '#64748b';
      if (soundEnabled) playSynthesizedSound('click');
    });
  }
}

function playSynthesizedSound(type) {
  if (!soundEnabled) return;
  try {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.connect(gain);
    gain.connect(audioContext.destination);

    const now = audioContext.currentTime;

    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.05);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'success') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'modal') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(640, now + 0.12);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
    }
  } catch (err) {
    // Audio context may require initial user gesture
  }
}

/* ===================================================================
   9. CONTACT FORM & FAST COPY ACTIONS
   =================================================================== */
function initContactInteractions() {
  const copyButtons = document.querySelectorAll('.btn-copy-chip');
  const contactForm = document.getElementById('portfolio-contact-form');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          const original = btn.innerText;
          btn.innerText = 'Copied! ✓';
          btn.style.background = '#10b981';
          btn.style.color = '#fff';
          playSynthesizedSound('success');
          setTimeout(() => {
            btn.innerText = original;
            btn.style.background = '';
            btn.style.color = '';
          }, 2000);
        });
      }
    });
  });

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Transmitting Message...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Message Transmitted!';
        submitBtn.classList.remove('btn-primary');
        submitBtn.classList.add('btn-emerald');
        playSynthesizedSound('success');

        alert("Thank you! Your message has been sent to Waqas Ali. Expect a response shortly!");
        contactForm.reset();

        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          submitBtn.classList.remove('btn-emerald');
          submitBtn.classList.add('btn-primary');
        }, 3000);
      }, 1200);
    });
  }

  // Back to top button
  const scrollTopBtn = document.getElementById('scroll-top-btn');
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}
