const output = document.getElementById("output");
const input = document.getElementById("commandInput");
const terminal = document.getElementById("terminal");
const buttons = document.querySelectorAll("[data-command]");

const history = [];
let historyIndex = 0;

const commands = {
  help: () => `
<span class="green-text">Available commands</span>

  <span class="cyan">about</span>        About me
  <span class="cyan">skills</span>       Technical skills
  <span class="cyan">projects</span>     Featured projects
  <span class="cyan">aws</span>          AWS & cloud experience
  <span class="cyan">terraform</span>    Infrastructure as Code
  <span class="cyan">docker</span>       Docker & containers
  <span class="cyan">kubernetes</span>   Kubernetes
  <span class="cyan">cicd</span>         Jenkins & GitHub Actions
  <span class="cyan">linux</span>        Linux & scripting
  <span class="cyan">github</span>       GitHub information
  <span class="cyan">resume</span>       Open resume
  <span class="cyan">contact</span>      Contact information
  <span class="cyan">neofetch</span>     System-style profile
  <span class="cyan">clear</span>        Clear terminal

<span class="muted">Tip: Use ↑ / ↓ for command history and Tab for autocomplete.</span>`,

  about: () => `
<span class="green-text">Mohammed Sahil R</span>

Cloud & DevOps Engineer based in Bengaluru, India.

B.E. in Electronics & Communication Engineering.

Focused on:
  • Cloud infrastructure
  • AWS
  • Infrastructure as Code
  • CI/CD automation
  • Docker & Kubernetes
  • Linux administration
  • Cloud monitoring and reliability

<span class="muted">Currently building practical cloud and DevOps projects.</span>`,

  skills: () => `
<span class="green-text">Technical Skills</span>

Cloud          AWS
IaC            Terraform
OS             Linux / Ubuntu
Containers     Docker
Orchestration  Kubernetes
CI/CD          Jenkins / GitHub Actions
Version Control Git / GitHub
Scripting      Python / Bash
Database       MySQL
Tools          Postman`,

  projects: () => `
<span class="green-text">Featured Projects</span>

<span class="project-title">[01] AWS Infrastructure with Terraform</span>
  VPC • EC2 • S3 • IAM • CloudWatch • Route 53
  Provisioned and managed AWS infrastructure using Terraform.

<span class="project-title">[02] Highly Available Cloud Web Application</span>
  VPC • EC2 • ALB • Auto Scaling • CloudWatch
  Built a highly available application architecture with monitoring.

<span class="project-title">[03] Containerized Application CI/CD Pipeline</span>
  Docker • Jenkins • GitHub Actions • Linux • Docker Hub
  Automated builds and Docker image publishing.

<span class="project-title">[04] Kubernetes Application Deployment</span>
  Kubernetes • Docker • YAML • kubectl
  Deployed containerized workloads using Deployments and Services.`,

  aws: () => `
<span class="green-text">AWS / Cloud</span>

EC2             Compute
VPC              Networking
S3               Object Storage
IAM              Identity & Access
CloudWatch       Monitoring
Lambda           Serverless
CloudFormation   Infrastructure
ALB              Load Balancing
Auto Scaling     Elastic Capacity
Route 53         DNS
EFS              Shared Storage

<span class="muted">Focus: designing, deploying and managing practical AWS infrastructure.</span>`,

  terraform: () => `
<span class="green-text">Terraform / Infrastructure as Code</span>

terraform init
      ↓
terraform fmt
      ↓
terraform validate
      ↓
terraform plan
      ↓
terraform apply
      ↓
terraform destroy

Resources practiced:
  VPC • Subnets • Route Tables • EC2 • S3
  IAM • Security Groups • Route 53 • CloudWatch

<span class="muted">Goal: reproducible and manageable cloud infrastructure.</span>`,

  docker: () => `
<span class="green-text">Docker</span>

  Containerized applications
  Built Docker images
  Published images to Docker Hub
  Worked with Dockerfiles
  Troubleshot containers and dependencies
  Integrated Docker into CI/CD workflows

Typical flow:

  Source Code → Build → Docker Image → Registry → Deployment`,

  kubernetes: () => `
<span class="green-text">Kubernetes</span>

  Pods
  Deployments
  Services
  ConfigMaps
  Secrets
  Replicas
  Rolling Updates
  kubectl troubleshooting

Example:

  kubectl get pods
  kubectl get deployments
  kubectl get services
  kubectl describe pod <name>
  kubectl logs <pod>`,

  cicd: () => `
<span class="green-text">CI/CD</span>

GitHub
   ↓
GitHub Actions / Jenkins
   ↓
Build
   ↓
Test
   ↓
Docker Image
   ↓
Docker Hub
   ↓
Deployment

Tools:
  Jenkins
  GitHub Actions
  Git
  GitHub
  Docker`,

  linux: () => `
<span class="green-text">Linux / Automation</span>

  Linux / Ubuntu administration
  Bash scripting
  Python automation
  Process management
  Permissions
  Networking
  Logs
  Troubleshooting
  System monitoring

<span class="muted">Comfortable working from the command line and automating repetitive tasks.</span>`,

  github: () => `
<span class="green-text">GitHub</span>

Profile:
  github.com/Mohammed-Sahil-R

Focus:
  • Cloud & DevOps projects
  • Infrastructure as Code
  • CI/CD
  • Docker
  • Kubernetes

<span class="cyan">https://github.com/Mohammed-Sahil-R</span>`,

  resume: () => {
    window.open("resume.pdf", "_blank");
    return `<span class="green-text">Opening resume.pdf ...</span>

<span class="muted">If it does not open, make sure resume.pdf is in the same folder as index.html.</span>`;
  },

  contact: () => `
<span class="green-text">Contact</span>

Email     <span class="cyan">mohammedsahilr39@gmail.com</span>
GitHub    <span class="cyan">github.com/Mohammed-Sahil-R</span>
LinkedIn  <span class="cyan">linkedin.com/in/mohammed-sahil-r/</span>
Location  Bengaluru, Karnataka, India

<span class="muted">Open to Cloud / DevOps / AWS / Infrastructure opportunities.</span>`,

  neofetch: () => `
<span class="ascii">
       .--.
      |o_o |       Mohammed Sahil R
      |:_/ |       Cloud & DevOps Engineer
     //   \\ \\      Bengaluru, India
    (|     | )     AWS • Terraform • Linux
   /'\\_   _/\\      Docker • Kubernetes
   \\___)=(___/     Jenkins • GitHub Actions
</span>`,

  clear: () => {
    output.innerHTML = "";
    return "";
  }
};

function printCommand(command) {
  const line = document.createElement("div");
  line.className = "line command-line";
  line.innerHTML = `<span class="prompt">mohammed@sahil:~$</span> <span class="command">${escapeHtml(command)}</span>`;
  output.appendChild(line);
}

function printOutput(html) {
  if (!html) return;
  const line = document.createElement("div");
  line.className = "line output";
  line.innerHTML = html.trim();
  output.appendChild(line);
}

function runCommand(raw) {
  const command = raw.trim().toLowerCase();
  if (!command) return;

  printCommand(raw);

  if (command === "clear") {
    output.innerHTML = "";
    return;
  }

  if (commands[command]) {
    printOutput(commands[command]());
  } else {
    printOutput(`<span class="yellow-text">bash: ${escapeHtml(command)}: command not found</span>

Type <span class="cyan">help</span> to see available commands.`);
  }

  scrollToBottom();
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function scrollToBottom() {
  terminal.scrollTop = terminal.scrollHeight;
}

function autocomplete() {
  const value = input.value.trim().toLowerCase();
  if (!value) return;

  const matches = Object.keys(commands).filter(cmd => cmd.startsWith(value));
  if (matches.length === 1) {
    input.value = matches[0];
  } else if (matches.length > 1) {
    printOutput(`<span class="muted">${matches.join("    ")}</span>`);
  }
}

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    const command = input.value.trim();
    if (!command) return;

    history.push(command);
    historyIndex = history.length;
    runCommand(command);
    input.value = "";
  }

  if (event.key === "ArrowUp") {
    event.preventDefault();
    if (historyIndex > 0) {
      historyIndex--;
      input.value = history[historyIndex];
    }
  }

  if (event.key === "ArrowDown") {
    event.preventDefault();
    if (historyIndex < history.length - 1) {
      historyIndex++;
      input.value = history[historyIndex];
    } else {
      historyIndex = history.length;
      input.value = "";
    }
  }

  if (event.key === "Tab") {
    event.preventDefault();
    autocomplete();
  }
});

buttons.forEach(button => {
  button.addEventListener("click", () => {
    const command = button.dataset.command;
    input.focus();

    if (command === "clear") {
      runCommand("clear");
      return;
    }

    history.push(command);
    historyIndex = history.length;
    runCommand(command);
  });
});

terminal.addEventListener("click", () => input.focus());

function welcome() {
  printOutput(`
<span class="ascii">
███╗   ███╗ ██████╗ ██╗  ██╗ █████╗ ███╗   ███╗███████╗██████╗
████╗ ████║██╔═══██╗██║  ██║██╔══██╗████╗ ████║██╔════╝██╔══██╗
██╔████╔██║██║   ██║███████║███████║██╔████╔██║█████╗  ██║  ██║
██║╚██╔╝██║██║   ██║██╔══██║██╔══██║██║╚██╔╝██║██╔══╝  ██║  ██║
██║ ╚═╝ ██║╚██████╔╝██║  ██║██║  ██║██║ ╚═╝ ██║███████╗██████╔╝
╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝╚═════╝
</span>

<span class="green-text">Mohammed Sahil R</span>  |  Cloud & DevOps Engineer
Bengaluru, India

Type <span class="cyan">help</span> to see available commands.

<span class="muted">Tip: Click a command below or type it and press Enter.</span>`);
  scrollToBottom();
}

welcome();
input.focus();
