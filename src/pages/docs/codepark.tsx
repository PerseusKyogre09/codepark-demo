import { useTheme } from '../../contexts/ThemeContext'
import { Shield, Zap, Users, CheckCircle, XCircle, Target, BookOpen, Briefcase, Bug, Rocket, Globe, Play, Settings } from 'lucide-react'
import codepark1 from '../../assets/docs/codepark/codepark1.png'

type Props = {
  onNavigate?: (id: string) => void
}

export default function CodePark({ onNavigate }: Props) {
  const { themeColors } = useTheme()

  return (
    <div className="space-y-8">
      <div className="text-left">
        <h1 className="text-4xl font-bold mb-4" style={{ color: themeColors.text }}>What is CodePark?</h1>
        <p className="text-lg" style={{ color: themeColors.textSecondary }}>
          Discover the world of Future, where collaborative development is as simple as sharing a link and logging in and collaborating on projects with your team members in real-time
        </p>
      </div>

      {/* Overview Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold" style={{ color: themeColors.text }}>Overview: A New Way to Code Together</h2>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="space-y-4">
            <p style={{ color: themeColors.textSecondary }}>
              Codepark brings on the fundamental shift in how teams work together during software development. Unlike traditional development environments that needs to be setup multiple times, here a single person needs to set it up and share it with the team.
            </p>
            <p style={{ color: themeColors.textSecondary }}>
              At its core, CodePark merges three revolutionary concepts: a powerful, full-featured code editor that rivals desktop IDEs, real-time multi-user collaboration that lets multiple developers work on the same codebase at the same time, and isolated execution environment that run your code securely in the cloud.
            </p>
            <p style={{ color: themeColors.textSecondary }}>
              Whether you're conducting pair programming sessions, teaching a coding workshop, or collaborating with a distributed team across the globe, CodePark eliminates the hurdle of environment setup and lets you focus purely on writing the code together that could change the world!
            </p>
          </div>
          <div className="flex justify-start">
            <img
              src={codepark1}
              alt="CodePark interface showing real-time collaboration"
              className="w-full max-w-md h-auto rounded-lg shadow-lg border"
              style={{ borderColor: themeColors.border }}
            />
          </div>
        </div>

        <div className="p-6 rounded-lg" style={{ background: themeColors.cardBg }}>
          <h3 className="text-xl font-medium mb-4" style={{ color: themeColors.text }}>No Setup Required</h3>
          <p style={{ color: themeColors.textSecondary }}>
            One of CodePark's most powerful features is its zero-setup philosophy. Traditional development often takes hours or even days to set up local environments, install dependencies, and make sure everything works on each team member's machine. CodePark removes this hassle; everything runs in the cloud, and all you need is a modern web browser.
          </p>
          <p style={{ color: themeColors.textSecondary }}>
            This approach saves time and makes sure everyone has the same experience. Every team member sees the exact same environment, uses the same versions of tools and libraries, and experiences identical behavior. There are no more "works on my machine" problems that often disrupt traditional development workflows.
          </p>
        </div>
      </section>

      {/* Core Concepts Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold" style={{ color: themeColors.text }}>Core Concepts: Understanding the Platform</h2>

        <p style={{ color: themeColors.textSecondary }}>
          Before diving into CodePark's features, it's essential to understand the fundamental concepts that shape how the platform operates. These concepts work together to create a seamless, collaborative development experience.
        </p>

        {/* Workspaces */}
        <div className="border-l-4 border-blue-500 pl-6 space-y-4">
          <h3 className="text-xl font-medium" style={{ color: themeColors.text }}>Workspaces: Your Project Environment</h3>

          <div className="grid md:grid-cols-2 gap-6 items-start">
            <div className="space-y-3">
              <p style={{ color: themeColors.textSecondary }}>
                A Codepark workspace is basically your project's digital home - a complete, self-contained environment that holds everything related to your development project. Think of it as a virtual machine that's always ready and accessible from anywhere.
              </p>
              <p style={{ color: themeColors.textSecondary }}>
                Every workspace holds your code and project settings. You get version control if you need it. It also provides a place for your code to run. This lets you run many projects at once. Each one gets its own isolated setup and files. You use workspaces for many things. Need to code alone quickly? Use a workspace. You also work with your team here. Or, you might just test an idea. Workspaces help CodePark fit any project or team size.
              </p>
            </div>
            <div className="flex justify-start">
              <img
                src="https://placehold.co/500x300/10B981/FFFFFF?text=Workspace+Diagram"
                alt="Workspace structure diagram"
                className="w-full max-w-sm h-auto rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>

        {/* Sessions */}
        <div className="border-l-4 border-green-500 pl-6 space-y-4">
          <h3 className="text-xl font-medium" style={{ color: themeColors.text }}>Sessions: Active Collaboration Instances</h3>

          <div className="grid md:grid-cols-2 gap-6 items-start">
            <div className="space-y-3">
              <p style={{ color: themeColors.textSecondary }}>
                When you open a workspace in CodePark, you're actually starting what's called a "session" - an active, collaborative instance of your project. This session becomes the central hub where all collaboration happens in real-time.
              </p>
              <p style={{ color: themeColors.textSecondary }}>
                Sessions are incredibly powerful because they handle multiple aspects of collaboration at the same time. When you create a session, a unique invite link is generated that you can share with collaborators. Anyone with this link can join instantly, either as viewer or editor on which you have full control.
              </p>
              <p style={{ color: themeColors.textSecondary }}>
                Rather than just editing the code, sessions manage presence awareness (showing who's online and what they're working on), while synchronizing execution state across all collaborators, while maintaining shared terminals and logs. This creates a truly shared development experience where everyone is working in the same virtual space.
              </p>
            </div>
            <div className="flex justify-start">
              <img
                src="https://placehold.co/500x300/8B5CF6/FFFFFF?text=Session+Collaboration+GIF"
                alt="Multiple users collaborating in a session"
                className="w-full max-w-sm h-auto rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Real-time Collaboration Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold" style={{ color: themeColors.text }}>Real-Time Collaboration: Code Together, Instantly</h2>

        <p style={{ color: themeColors.textSecondary }}>
          CodePark's real-time collaboration features depicts a big jump from traditional code review and pair programming methods. Instead of waiting for turns or reviewing changes after the fact, team members can work or supervise together in real time, seeing watching the changes happening in real-time.
        </p>

        {/* Live Editing */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
          <h3 className="text-xl font-medium mb-4" style={{ color: themeColors.text }}>Live Editing: Monitor Changes in Real-Time</h3>

          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div className="space-y-3">
              <p style={{ color: themeColors.textSecondary }}>
                Live editing in CodePark means that every keypress, cursor seeking, and selection is instantly visible to all collaborators. If you're working with a teammate and they start coding a function, you'll see their cursor moving and the code appearing in real-time.
              </p>
              <p style={{ color: themeColors.textSecondary }}>
                This goes beyond simple text synchronization - CodePark uses operational transformation algorithms to merge concurrent edits intelligently. Multiple people can edit the same file simultaneously without any conflicts, and the system automatically resolves any potential merge issues.
              </p>
              <p style={{ color: themeColors.textSecondary }}>
                The result is a fluid, natural coding experience that mimics the feeling of sitting side-by-side with your collaborators, even when you're continents apart. This enables true pair programming, mob programming, and interactive code reviews that happen in real-time rather than asynchronously.
              </p>
            </div>
            <div className="flex justify-start">
              <img
                src="https://placehold.co/600x300/059669/FFFFFF?text=Live+Editing+Demo+GIF"
                alt="Live editing with multiple cursors"
                className="w-full max-w-md h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* Presence Awareness */}
        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
          <h3 className="text-xl font-medium mb-4" style={{ color: themeColors.text }}>Presence Awareness: Know Who's Working Where</h3>

          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div className="space-y-3">
              <p style={{ color: themeColors.textSecondary }}>
                Presence awareness is a crucial feature that makes collaboration feel natural and intuitive. Each collaborator in a CodePark session has a visible cursor with their name or identifier and a unique colored cursor, showing exactly where they are in the codebase and what are they working on.
              </p>
              <p style={{ color: themeColors.textSecondary }}>
                This awareness doesn't just means cursor positions - you can see when someone is actively typing, when they've selected text, and even when they're viewing different parts of the code. It's like having a virtual office where you can instantly see what your colleagues are working on.
              </p>
              <p style={{ color: themeColors.textSecondary }}>
                Presence awareness helps prevent accidental conflicts, enables better coordination during complex debugging sessions, and makes it easy to follow along when someone is demonstrating a concept or walking through code changes.
              </p>
            </div>
            <div className="flex justify-start">
              <img
                src="https://placehold.co/500x300/DC2626/FFFFFF?text=Presence+Awareness+Diagram"
                alt="Presence indicators showing user locations"
                className="w-full max-w-md h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* Shared Execution */}
        <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
          <h3 className="text-xl font-medium mb-4" style={{ color: themeColors.text }}>Shared Terminals and Execution: Collective Debugging</h3>

          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div className="space-y-3">
              <p style={{ color: themeColors.textSecondary }}>
                One of the most powerful aspects of CodePark's collaboration features is shared execution. When you run code in a session, every participant sees the output in real-time. Whether it's terminal commands, program execution, or debugging output, everyone experiences the exact same results simultaneously.
              </p>
              <p style={{ color: themeColors.textSecondary }}>
                This shared execution model transforms debugging from a solitary activity into a collaborative one. Team members can collectively watch test outputs, trace through program execution, and discuss results as they happen. It's particularly valuable for teaching scenarios, where an instructor can demonstrate concepts while students see the exact same output.
              </p>
              <p style={{ color: themeColors.textSecondary }}>
                The shared terminal experience means that commands typed by any collaborator are visible to all, creating a truly interactive coding environment where knowledge and insights can be shared instantly.
              </p>
            </div>
            <div className="flex justify-start">
              <img
                src="https://placehold.co/600x300/7C3AED/FFFFFF?text=Shared+Terminal+GIF"
                alt="Shared terminal output for all users"
                className="w-full max-w-md h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Isolated Code Execution Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold" style={{ color: themeColors.text }}>Isolated Code Execution: Secure, Consistent, Reliable</h2>

        <p style={{ color: themeColors.textSecondary }}>
          CodePark's execution model is built around the Isolation principle - every piece of code runs in its secure, sandboxed environment. This approach ensures security, prevents interference between projects, and provides consistent behavior across all executions.
        </p>

        {/* Execution Model */}
        <div className="border-l-4 border-orange-500 pl-6 space-y-4">
          <h3 className="text-xl font-medium" style={{ color: themeColors.text }}>The Execution Lifecycle</h3>

          <div className="grid md:grid-cols-2 gap-6 items-start">
            <div className="space-y-3">
              <p style={{ color: themeColors.textSecondary }}>
                When you execute code in CodePark, a sophisticated process is executed behind the scenes. First a fresh execution environment is prepared then a clean, isolated container or runtime that's completely separate from any previous executions.
              </p>
              <p style={{ color: themeColors.textSecondary }}>
                Your project files are then mounted into this environment, giving your code access to its dependencies and configuration while maintaining strict isolation from the underlying system. The selected command or script is executed, and all output is streamed back to your session in real-time.
              </p>
              <p style={{ color: themeColors.textSecondary }}>
                After execution completes, the environment is completely cleaned up, ensuring no residual contents affects future runs. This clean-slate approach guarantees predictable behavior and prevents issues that can arise from accumulated state in traditional development environments.
              </p>
            </div>
            <div className="flex justify-start">
              <img
                src="https://placehold.co/500x300/EA580C/FFFFFF?text=Execution+Lifecycle+Diagram"
                alt="Execution environment lifecycle diagram"
                className="w-full max-w-sm h-auto rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>

        {/* Container-based Isolation */}
        <div className="border-l-4 border-red-500 pl-6 space-y-4">
          <h3 className="text-xl font-medium" style={{ color: themeColors.text }}>Container-Based Security</h3>

          <div className="grid md:grid-cols-2 gap-6 items-start">
            <div className="space-y-3">
              <p style={{ color: themeColors.textSecondary }}>
                Most code execution in CodePark happens within Docker containers, providing enterprise-grade isolation and security. Each container is configured with strict resource limits - CPU cores, memory allocation, and filesystem access are all carefully controlled. The resource limits can be increased by purchasing the PRO Plan
              </p>
              <p style={{ color: themeColors.textSecondary }}>
                Network permissions are also tightly managed, preventing unauthorized access to external services and protecting against potential security vulnerabilities. This containerization ensures that even if code contains malicious elements, it cannot escape its sandbox or affect other users' projects. It also ensures projects do not affect the real system example Virus testing.
              </p>
              <p style={{ color: themeColors.textSecondary }}>
                The container approach also enables CodePark to support a wide variety of programming languages and frameworks, as each project can specify its own runtime environment and dependencies without conflicting with others.
              </p>
            </div>
            <div className="flex justify-start">
              <img
                src="https://placehold.co/500x300/D97706/FFFFFF?text=Container+Security+Diagram"
                alt="Container isolation security model"
                className="w-full max-w-sm h-auto rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>

        {/* WebAssembly Support */}
        <div className="border-l-4 border-indigo-500 pl-6 space-y-4">
          <h3 className="text-xl font-medium" style={{ color: themeColors.text }}>WebAssembly Runtimes</h3>

          <div className="grid md:grid-cols-2 gap-6 items-start">
            <div className="space-y-3">
              <p style={{ color: themeColors.textSecondary }}>
                For certain use cases, CodePark leverages WebAssembly (Wasm) runtimes to provide even faster startup times and tighter sandboxing. WebAssembly allows code to run at near-native speeds directly in the browser, eliminating the overhead of traditional containerization.
              </p>
              <p style={{ color: themeColors.textSecondary }}>
                This technology is particularly valuable for lightweight scripting languages and rapid prototyping scenarios where instant execution feedback is crucial. The choice between container and Wasm execution is handled automatically by CodePark based on the project type and requirements.
              </p>
              <p style={{ color: themeColors.textSecondary }}>
                WebAssembly support represents the cutting edge of browser-based execution, enabling CodePark to provide desktop-like performance for an increasingly wide range of development tasks.
              </p>
            </div>
            <div className="flex justify-start">
              <img
                src="https://placehold.co/500x300/2563EB/FFFFFF?text=WASM+Execution+Diagram"
                alt="WebAssembly runtime execution"
                className="w-full max-w-sm h-auto rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Security & Safety */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold" style={{ color: themeColors.text }}>Security & Safety: Enterprise-Grade Protection</h2>

        <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg">
          <p style={{ color: themeColors.textSecondary }}>
            Security is not an afterthought in CodePark - it's baked into every aspect of the platform. Every execution environment is isolated, every resource is limited, and every interaction is monitored. This comprehensive security model ensures that your code and data remain safe while you collaborate.
          </p>

          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-800 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-8 h-8" style={{ color: themeColors.error || '#EF4444' }} />
              </div>
              <h4 className="font-medium mb-2" style={{ color: themeColors.text }}>Isolated Environments</h4>
              <p className="text-sm" style={{ color: themeColors.textSecondary }}>
                Each code execution runs in its own sandbox, preventing interference between projects and users.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap className="w-8 h-8" style={{ color: themeColors.primary || '#2563EB' }} />
              </div>
              <h4 className="font-medium mb-2" style={{ color: themeColors.text }}>Resource Limits</h4>
              <p className="text-sm" style={{ color: themeColors.textSecondary }}>
                CPU, memory, and network access are strictly controlled to prevent abuse and ensure fair usage.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-8 h-8" style={{ color: themeColors.success || '#10B981' }} />
              </div>
              <h4 className="font-medium mb-2" style={{ color: themeColors.text }}>Private by Default</h4>
              <p className="text-sm" style={{ color: themeColors.textSecondary }}>
                Projects are private unless explicitly shared, and collaboration happens without exposing local credentials.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What CodePark Is and Is Not */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold" style={{ color: themeColors.text }}>What CodePark Is (and What It Isn't)</h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-6 rounded-lg" style={{ background: themeColors.cardBg }}>
            <h3 className="text-xl font-medium mb-4 flex items-center gap-2" style={{ color: themeColors.text }}>
              <CheckCircle className="w-5 h-5" style={{ color: themeColors.success || '#10B981' }} />
              What CodePark Is
            </h3>
            <ul className="space-y-3" style={{ color: themeColors.textSecondary }}>
              <li className="flex items-start">
                <span className="mr-2" style={{ color: themeColors.success || '#10B981' }}>•</span>
                <span>A powerful collaborative Integrated Development Environment (IDE) that runs entirely in your web browser</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2" style={{ color: themeColors.success || '#10B981' }}>•</span>
                <span>A secure platform for executing code in isolated environments, perfect for learning, prototyping, and team collaboration</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2" style={{ color: themeColors.success || '#10B981' }}>•</span>
                <span>A tool designed for both individual developers and teams, supporting everything from solo coding to large group sessions</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2" style={{ color: themeColors.success || '#10B981' }}>•</span>
                <span>A modern development environment that eliminates setup friction and lets you focus on writing code</span>
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-lg" style={{ background: themeColors.cardBg }}>
            <h3 className="text-xl font-medium mb-4 flex items-center gap-2" style={{ color: themeColors.text }}>
              <XCircle className="w-5 h-5" style={{ color: themeColors.warning || '#F59E0B' }} />
              What CodePark Isn't..
            </h3>
            <ul className="space-y-3" style={{ color: themeColors.textSecondary }}>
              <li className="flex items-start">
                <span className="mr-2" style={{ color: themeColors.warning || '#F59E0B' }}>•</span>
                <span>A replacement for production servers or long-running applications requiring 24/7 availability</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2" style={{ color: themeColors.warning || '#F59E0B' }}>•</span>
                <span>A full desktop operating system with unlimited resources and unrestricted access</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2" style={{ color: themeColors.warning || '#F59E0B' }}>•</span>
                <span>A hosting platform for permanent web applications (unless explicitly configured for that purpose)</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2" style={{ color: themeColors.warning || '#F59E0B' }}>•</span>
                <span>A local development environment - it's designed for cloud-based collaboration</span>
              </li>
            </ul>
          </div>
        </div>

        <p style={{ color: themeColors.textSecondary }}>
          Understanding these distinctions is crucial for getting the most out of CodePark. It's optimized for collaborative development, learning, and rapid prototyping rather than serving as a production hosting platform or a complete desktop replacement.
        </p>
      </section>

      {/* When to Use CodePark */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold" style={{ color: themeColors.text }}>When to Use CodePark: Perfect Use Cases</h2>

        <p style={{ color: themeColors.textSecondary }}>
          CodePark excels in scenarios where collaboration, rapid iteration, and zero-setup are more valuable than unlimited resources or permanent hosting. Here are the situations where CodePark truly shines:
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="font-medium mb-2 flex items-center gap-2" style={{ color: themeColors.text }}>
              <Target className="w-4 h-4" style={{ color: themeColors.primary || '#2563EB' }} />
              Pair Programming
            </h4>
            <p className="text-sm" style={{ color: themeColors.textSecondary }}>
              Work side-by-side with another developer in real-time, sharing ideas and solving problems together instantly.
            </p>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <h4 className="font-medium mb-2 flex items-center gap-2" style={{ color: themeColors.text }}>
              <BookOpen className="w-4 h-4" style={{ color: themeColors.success || '#10B981' }} />
              Teaching & Workshops
            </h4>
            <p className="text-sm" style={{ color: themeColors.textSecondary }}>
              Conduct interactive coding lessons where students can follow along and execute code simultaneously.
            </p>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <h4 className="font-medium mb-2 flex items-center gap-2" style={{ color: themeColors.text }}>
              <Briefcase className="w-4 h-4" style={{ color: themeColors.accent || '#8B5CF6' }} />
              Technical Interviews
            </h4>
            <p className="text-sm" style={{ color: themeColors.textSecondary }}>
              Evaluate candidates in a realistic coding environment with shared execution and real-time collaboration.
            </p>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
            <h4 className="font-medium mb-2 flex items-center gap-2" style={{ color: themeColors.text }}>
              <Bug className="w-4 h-4" style={{ color: themeColors.warning || '#F59E0B' }} />
              Collaborative Debugging
            </h4>
            <p className="text-sm" style={{ color: themeColors.textSecondary }}>
              Debug complex issues together, with everyone seeing the same output and execution state.
            </p>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
            <h4 className="font-medium mb-2 flex items-center gap-2" style={{ color: themeColors.text }}>
              <Rocket className="w-4 h-4" style={{ color: themeColors.error || '#EF4444' }} />
              Rapid Prototyping
            </h4>
            <p className="text-sm" style={{ color: themeColors.textSecondary }}>
              Experiment with new ideas quickly without worrying about environment setup or dependency conflicts.
            </p>
          </div>

          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
            <h4 className="font-medium mb-2 flex items-center gap-2" style={{ color: themeColors.text }}>
              <Globe className="w-4 h-4" style={{ color: themeColors.primary || '#4F46E5' }} />
              Remote Teams
            </h4>
            <p className="text-sm" style={{ color: themeColors.textSecondary }}>
              Enable seamless collaboration across time zones and locations with shared, persistent workspaces.
            </p>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold" style={{ color: themeColors.text }}>Summary: The Future of Collaborative Development</h2>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-8 rounded-lg">
          <p style={{ color: themeColors.textSecondary }} className="text-lg leading-relaxed">
            CodePark represents a fundamental rethinking of how software development teams collaborate. By combining real-time editing, secure isolated execution, and browser-based accessibility, it eliminates the traditional barriers of setup time, environment inconsistencies, and geographical separation.
          </p>
          <p style={{ color: themeColors.textSecondary }} className="text-lg leading-relaxed mt-4">
            Whether you're teaching a class, conducting a technical interview, debugging with teammates, or simply exploring new technologies, CodePark provides the perfect environment to focus on what matters most: writing great code together.
          </p>
          <p style={{ color: themeColors.textSecondary }} className="text-lg leading-relaxed mt-4">
            The platform's commitment to security, consistency, and collaboration makes it not just a tool, but a catalyst for more effective, more enjoyable, and more productive development experiences.
          </p>
        </div>
      </section>

      {/* Navigation */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold" style={{ color: themeColors.text }}>Next Steps</h2>

        <div className="p-6 rounded-lg" style={{ background: themeColors.cardBg }}>
          <p className="text-sm mb-4" style={{ color: themeColors.textSecondary }}>
            Continue exploring CodePark's features to enhance your development workflow.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => onNavigate?.('quick-start')}
              className="flex items-center gap-3 p-4 rounded-lg border transition-colors group hover:opacity-80"
              style={{ background: themeColors.cardBg, borderColor: themeColors.border }}
            >
              <Rocket className="w-6 h-6 group-hover:scale-110 transition-transform" style={{ color: themeColors.primary || '#2563EB' }} />
              <div className="text-left">
                <div className="font-medium text-sm" style={{ color: themeColors.text }}>Quick Start</div>
                <div className="text-xs" style={{ color: themeColors.textSecondary }}>Get up and running fast</div>
              </div>
            </button>

            <button
              onClick={() => onNavigate?.('running-code')}
              className="flex items-center gap-3 p-4 rounded-lg border transition-colors group hover:opacity-80"
              style={{ background: themeColors.cardBg, borderColor: themeColors.border }}
            >
              <Play className="w-6 h-6 group-hover:scale-110 transition-transform" style={{ color: themeColors.success || '#10B981' }} />
              <div className="text-left">
                <div className="font-medium text-sm" style={{ color: themeColors.text }}>Running Code</div>
                <div className="text-xs" style={{ color: themeColors.textSecondary }}>Execute your programs</div>
              </div>
            </button>

            <button
              onClick={() => onNavigate?.('roles-permissions')}
              className="flex items-center gap-3 p-4 rounded-lg border transition-colors group hover:opacity-80"
              style={{ background: themeColors.cardBg, borderColor: themeColors.border }}
            >
              <Users className="w-6 h-6 group-hover:scale-110 transition-transform" style={{ color: themeColors.accent || '#8B5CF6' }} />
              <div className="text-left">
                <div className="font-medium text-sm" style={{ color: themeColors.text }}>Collaboration & Roles</div>
                <div className="text-xs" style={{ color: themeColors.textSecondary }}>Team management</div>
              </div>
            </button>

            <button
              onClick={() => onNavigate?.('execution-limits')}
              className="flex items-center gap-3 p-4 rounded-lg border transition-colors group hover:opacity-80"
              style={{ background: themeColors.cardBg, borderColor: themeColors.border }}
            >
              <Settings className="w-6 h-6 group-hover:scale-110 transition-transform" style={{ color: themeColors.warning || '#F59E0B' }} />
              <div className="text-left">
                <div className="font-medium text-sm" style={{ color: themeColors.text }}>Execution Limits</div>
                <div className="text-xs" style={{ color: themeColors.textSecondary }}>Resource management</div>
              </div>
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
