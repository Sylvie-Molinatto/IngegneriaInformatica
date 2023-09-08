default: scanner parser

	javac *.java

scanner:
	jflex scanner.jflex

parser:
	java java_cup.Main -parser parser parser.cup

clean:

	rm -fr parser.java Yylex.java sym.java
	rm -vfr *.class
	rm -vfr *.*~

init:
	mkdir source build

run:
	java Main example.txt

new: default run
