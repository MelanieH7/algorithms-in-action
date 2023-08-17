import parse from '../../pseudocode/parse';

export default parse(`
\\Note{  REAL specification Union Find
  In development
  Lee Naish
  Sun Jun 11 18:07:23 AEST 2023
  \\Note}
  
  \\Note{
  Current version uses union by rank and path halving for find due to
  simple coding + its easy to separate path compression
  
  Could be good to provide button/... to eliminate path compression so
  students can explore what can happen without it
  
  Tentative idea for visualisation is to have array view, with rows
  for n, parent[n] and rank[n] plus forest view
  The forest could have fixed width columns with one number+rank per
  column, the numbers sorted within each tree and the trees sorted
  according to their roots. Rank information could be elided for some
  levels of abstraction.
  \\Note}
  
  \\Overview{
  
  Union Find algorithms allow us to maintain and manipulate the partitioning
  of a set into (disjoint) subsets. There are two main operations supported:
  Union and Find. Union takes two subsets and merges them together to form
  a single subset.  Find takes and element and returns a representative
  element of the subset it occurs in. It must be the case that find(n) ==
  find(m) if and only if n and m are in the same subset, but which element
  is returned is left to the implementation (this flexibility allows for
  simple, efficient solutions). There may also be an operation to add
  an additional element in a singleton subset; here we simply initialise
  the data structure with a fixed number of elements, each in a singleton
  subset. It is often convenient to number the elements 0, 1, 2,... allowing
  the array-based solution we present here.
  
  XXX include applications? - graph connectivity, unification??,
  reflexive+transitive relations??...
  
  Union-Find has many and varied applications.  For example, to determine
  connected components of an undirected graph, we can simply call
  Union(a,b) for each edge a-b in the graph.
  
  To represent a partitioning with N subsets we use N trees, each containing
  the elements of the subset. Each element in the tree points to the parent
  node, with the root node pointing to itself (a bit of a trick that makes
  code simpler). A node can have many children pointing to it. Find returns
  the root node and union joins two trees together.  There are some subtle
  aspects to ensure the height of the trees is kept small, so finding the
  root can be done very quickly.  Extra information is maintained for each
  subset so Union can reduce the height and when Find traverses a path
  from a node to the root, we take the opportunity to reduce the length
  of the path for future calls to Find (the tree height is reduced and the
  "width" is increased by having more children for some nodes).
  
  Interestingly, the extra information used to reduce the height is only
  approximate and the method used to reduce path lengths is not as thorough
  as some obvious alternatives. These shortcuts make the code very simple,
  but it is still extremely effective at reducing the tree height - most
  nodes point directly to the root. It has been shown that no matter how
  large the set is, Find has takes very close to constant time on average
  (the inverse of the Ackerman function to be precise).
  
  \\Overview}
  
  \\Note{ Could keep tree representation more abstract but I think its
    best to be up-front with array representation and how roots
    are distinguished
  \\Note}
  \\Code{
  Main
  Find(n) // return root of tree containing n
  \\In{
      while parent[n] != n // while we are not at the root
      \\In{
          shorten path from n to root \\Ref Shorten_path
          \\Expl{ There are several ways of shortening the path back to the
                  root. The most obvious is to follow the path to the root
                  then follow it again, making each element point to the
                  root. The version here doesn't shorten the path as much
                  but is simpler and overall it works extremely well.
          \\Expl} 
          n <- parent[n]  // go up the tree one step
      \\In}
      return n // return root
  \\In} 
  \\Code}
  
  \\Code{
  Shorten_path
      parent[n] = parent[parent[n]] // point to grandparent, not parent
      \\Expl{ By replacing the parent pointer by a pointer to the
              grandparent at each step up the tree, the path length is
              halved. This turns out to be sufficient to keep paths very
              short.
      \\Expl} 
  \\Code} 
  
  \\Code{
  Union
  Union(n, m) // merge/union the subsets containing n and m, respectively
  \\In{
      n <- Find(n)
      m <- Find(m)
      if n == m // in same subset already - nothing to do
          return
      swap n and m if needed to ensure m is the "taller" subtree \\Ref Maybe_swap
      parent[n] = m // add the shorter subtree (n) to the taller one (m)
      \\Expl{ This sometimes increases the height of the resulting tree but
              if we added the taller to the shorter the height would always
              increase.
      \\Expl} 
      adjust the "height" measure of the taller subtree (m) \\Ref Adjust_rank
      \\Expl{ The shorter subtree remains the same but the taller one
              may have grown because it had had an extra subtree added.
      \\Expl} 
  \\In} 
  \\Code}
  
  \\Code{
  Maybe_swap
      if rank[n] > rank[m]
          \\Expl{ We maintain a "rank" for each subset, which is an upper
                  bound on the height. The actual height may be less due
                  to paths being shortened in Find.
          \\Expl} 
          swap(n, m)
  \\Code}
  
  \\Code{
  Adjust_rank
      if rank[n] == rank[m]
          \\Expl{  If we are adding a strictly shorter subtree to m the height
                  doesn't change, but if the heights were equal the new height
                  of m increases by one.
          \\Expl}
          rank[m] <- rank[m] + 1
          \\Note{ Should we use ++ or "increment"???
          \\Note}
  \\Code}
  
  \\Note{
  // Union Find: simple implementation for testing animation specification
  // Sample test:
  /*
  % cat << END > test1
  f 2
  u 2 3
  f 2
  u 1 3
  p
  u 5 4
  u 3 4
  f 2
  p
  u 1 0
  p
  END
  % ./a.out < test1
  Found 2 from 2
  Merged 2 and 3
  Found 3 from 2
  Merged 1 and 3
  n           0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19
  parent[n]   0  3  3  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19
  rank[n]     0  0  0  1  0  0  0  0  0  0  0  0  0  0  0  0  0  0  0  0
  Merged 5 and 4
  Merged 3 and 4
  Found 4 from 2
  n           0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19
  parent[n]   0  3  4  4  4  4  6  7  8  9 10 11 12 13 14 15 16 17 18 19
  rank[n]     0  0  0  1  2  0  0  0  0  0  0  0  0  0  0  0  0  0  0  0
  Merged 1 and 0
  n           0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19
  parent[n]   4  4  4  4  4  4  6  7  8  9 10 11 12 13 14 15 16 17 18 19
  rank[n]     0  0  0  1  2  0  0  0  0  0  0  0  0  0  0  0  0  0  0  0
  
  */
  #include<stdio.h>
  #include<stdlib.h>
  
  #define demand(fact, remark)\\
      {   if (!(fact))\\
          {   fprintf(stderr, "%s\n", remark); exit(1);   }\\
      }
  
  #define SIZE 20    // (max) size of set we are partitioning
  int parent[SIZE];  // parent for each node
  int rank[SIZE];    // rank for each node
  #ifdef NOCOMPRESS       
  int compresspaths = 0;
  #else
  int compresspaths = 1;
  #endif
  
  // add operation; here we add all the elements in the array
  // at the start, don't keep track whats in the set and don't
  // expand the array
  // Might be better to store max, and have int add(void)
  void
  add(int n) {
      demand(n < SIZE, "too big!");
      parent[n] = n;
      rank[n] = 0;
  }
  
  // find operation
  int
  find(int n) {
      while (parent[n] != n){
          // we want to compress paths in some way, eg path halving as
          // done here but might want the option of avoiding it so
          // students can see what happens without it
          if (compresspaths)
                  parent[n] = parent[parent[n]];
          n = parent[n];
      }
      return n;
  }
  
  // union operation, called merge since union is a C keyword
  void
  merge(int n, int m) {
      n = find(n);
      m = find(m);
      if (n == m) // in same set - nothing to do
          return;
      if (rank[n] > rank[m]) { // if n a larger tree, swap n and m
          int tmp = m;
          m = n;
          n = tmp;
      }
      parent[n] = m; // make smaller tree (n) a subtree of larger (m)
      if (rank[n] == rank[m]) // adjust size (rank) of new root
          rank[m]++;
      return;
  }
  
  int
  main() {
      int c, n1, n2;
      for (n1 = 0; n1 < SIZE; n1++)
          add(n1);
      // we have find, union + print commands
      // could have add + toggle path compression
      while ((c = getchar()) != EOF) {
          if (c == 'f') {    // find element; print root
              scanf("%d", &n1);
              demand(n1 < SIZE, "too big!");
              n2 = find(n1);
              printf("Found %d from %d\n", n2, n1);
          } else if (c == 'u') { // union/merge two sets
              scanf("%d %d", &n1, &n2);
              demand(n1 < SIZE, "too big!");
              demand(n2 < SIZE, "too big!");
              merge(n1, n2);
              printf("Merged %d and %d\n", n1, n2);
          } else if (c == 'p') { // print current state
              printf("n         ");
              for (n1 = 0; n1 < SIZE; n1++)
                  printf("%3d", n1);
              printf("\n");
              printf("parent[n] ");
              for (n1 = 0; n1 < SIZE; n1++)
                  printf("%3d", parent[n1]);
              printf("\n");
              printf("rank[n]   ");
              for (n1 = 0; n1 < SIZE; n1++)
                  printf("%3d", rank[n1]);
              printf("\n");
          }
      }
      return 0;
  }
   
  /* Example of test
  
  
  */
  \\Note} 
  
  \\Note{
  Handy things to copy/paste in vim for editing this file:
  (mostly in my .exrc now)
  :set ts=4 et
  
  \\In{
  \\In}
  
  \\Note}  
`);
