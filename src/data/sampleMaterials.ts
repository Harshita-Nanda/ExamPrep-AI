export interface SampleMaterial {
  id: string;
  title: string;
  category: string;
  icon: string;
  description: string;
  text: string;
}

export const SAMPLE_MATERIALS: SampleMaterial[] = [
  {
    id: 'cs-oop-inheritance',
    title: 'Object-Oriented Programming: Inheritance in Java',
    category: 'Computer Science',
    icon: 'Code',
    description: 'Classes, super & subclass, code reusability, method overriding, and polymorphism.',
    text: `Topic: Object-Oriented Programming (OOP) - Inheritance in Java

1. Definition & Fundamental Concept:
Inheritance is an OOP mechanism in which one class (known as the subclass, derived class, or child class) acquires the properties (fields) and behaviors (methods) of another class (superclass, base class, or parent class).
Syntax in Java: class ChildClass extends ParentClass { ... }

2. Objectives and Advantages:
- Code Reusability: Common attributes and methods defined in a parent class can be directly reused by multiple child classes without redundant implementation.
- Method Overriding (Runtime Polymorphism): A subclass can provide a specific implementation of a method that is already defined in its superclass using the @Override annotation.
- Method Overloading vs Overriding: Overloading occurs at compile-time with different parameter signatures; overriding occurs at runtime with identical method signatures.

3. Types of Inheritance in Java:
- Single Inheritance: Class B extends Class A.
- Multilevel Inheritance: Class C extends Class B, which extends Class A.
- Hierarchical Inheritance: Class B and Class C both extend Class A.
Note on Multiple Inheritance: Java does NOT support multiple inheritance through classes (e.g., class C extends A, B) to prevent the "Diamond Problem" (ambiguity in method resolution). Multiple inheritance is achieved exclusively through Interfaces.

4. The 'super' Keyword:
- super() invokes the direct parent class constructor.
- super.methodName() invokes an overridden method of the parent class.
- super.fieldName accesses hidden parent member fields.

5. Access Modifiers in Inheritance:
- Private members of the superclass are NOT inherited directly by the subclass (must be accessed via public/protected getters and setters).
- Protected members are accessible within the same package and by subclasses in different packages.
- Final classes cannot be extended; final methods cannot be overridden.`,
  },
  {
    id: 'bio-photosynthesis',
    title: 'Photosynthesis & Cellular Respiration',
    category: 'Biology',
    icon: 'Leaf',
    description: 'Light-dependent reactions, Calvin cycle, Krebs cycle, and electron transport chain.',
    text: `Photosynthesis and Cellular Respiration Lecture Notes

Part 1: Photosynthesis Overview
Photosynthesis converts solar energy into chemical energy stored in glucose. The process occurs in plant chloroplasts and consists of two stages:
1. Light-Dependent Reactions: Take place in thylakoid membranes. Chlorophyll pigments absorb photons, exciting electrons in Photosystem II (PSII) and Photosystem I (PSI). Water photolysis splits H2O into oxygen (O2 waste product), protons (H+ gradient across thylakoid lumen), and electrons. ATP is generated via photophosphorylation driven by ATP synthase, and NADP+ is reduced to NADPH.
2. The Calvin Cycle (Light-Independent Reactions): Occurs in the stroma. Carbon fixation is catalyzed by the enzyme RuBisCO (ribulose-1,5-bisphosphate carboxylase-oxygenase), incorporating CO2 into 3-PGA, which is then reduced to G3P (glyceraldehyde-3-phosphate) using ATP and NADPH. Every 3 turns of the cycle produce one net G3P molecule for sugar biosynthesis.

Part 2: Cellular Respiration
Cellular respiration breaks down glucose to produce cellular ATP in eukaryotic cells. It consists of:
1. Glycolysis: Cytoplasm, anaerobic. Glucose (6C) is cleaved into 2 Pyruvate (3C), netting 2 ATP and 2 NADH.
2. Pyruvate Oxidation: Mitochondrial matrix. Pyruvate is converted to Acetyl-CoA, releasing CO2 and producing 1 NADH per pyruvate.
3. Citric Acid Cycle (Krebs Cycle): Matrix. Acetyl-CoA combines with oxaloacetate to form citrate. Yields 2 ATP/GTP, 6 NADH, 2 FADH2, and 4 CO2 per glucose molecule.
4. Oxidative Phosphorylation & Electron Transport Chain (ETC): Inner mitochondrial membrane. High-energy electrons from NADH and FADH2 pass through Complexes I-IV, pumping protons into the intermembrane space. The resulting electrochemical proton-motive force drives ATP synthase (chemiosmosis), yielding approximately 26-28 ATP. Oxygen acts as the terminal electron acceptor, forming water.`,
  },
  {
    id: 'cs-memory',
    title: 'OS Virtual Memory & Page Replacement',
    category: 'Operating Systems',
    icon: 'Cpu',
    description: 'Paging, TLB, page faults, virtual addresses, and LRU eviction algorithms.',
    text: `Operating Systems Lecture: Virtual Memory, Paging, and Memory Management

1. The Purpose of Virtual Memory:
Virtual memory provides an illusion of a large, contiguous, private address space for each running process, regardless of physical RAM limits. Key benefits:
- Isolation and Memory Protection: A process cannot accidentally or maliciously access another process's or kernel memory.
- Efficient Physical Memory Utilization: Only active pages need to reside in physical RAM (Demand Paging); idle or inactive pages can reside on backing secondary storage (swap/disk).
- Simplified Linking and Loading: Compilers can produce code with standardized logical base addresses without knowing physical hardware placement.

2. Paging Hardware and Address Translation:
- The Memory Management Unit (MMU) translates Virtual Addresses to Physical Addresses using Page Tables.
- A virtual address is partitioned into:
  * Page Number (p): Index into the Page Table.
  * Page Offset (d): Distance from the page boundary, transferred directly to the physical address.
- Page Table Entries (PTE) contain the physical Frame Number, Valid/Invalid bit (indicates whether the page is currently loaded in RAM), Dirty/Modified bit, and Access Permission bits (Read/Write/Execute).
- Translation Lookaside Buffer (TLB): A high-speed hardware associative cache for recent virtual-to-physical address translations. A TLB hit avoids an expensive extra memory access to walk the multi-level page table.

3. Page Faults and Handling Routine:
When a CPU executes an instruction referencing an address whose PTE valid bit is 0:
1. The MMU raises a hardware interrupt (Page Fault trap) transferring control to the OS kernel.
2. The OS inspects internal PCB structures to verify whether the memory access is valid or a segmentation fault.
3. If valid, the OS finds a free physical frame in RAM (or selects a victim frame via page replacement if RAM is full).
4. The OS issues an asynchronous disk I/O request to load the requested page from swap/storage into the target frame.
5. Once I/O completes, the OS updates the PTE to valid, updates the TLB, and restarts the instruction that caused the trap.`,
  },
];
