extern int ASM_funct(int, int, int, int, int, int);
extern int check_square(int x, int y, int r);
extern float my_division(float *a, float *b);

extern char _ROWS;
extern char _COLUMNS;
extern int _Matrix_Coordinates[11][22];

int calculate_area(int);

int main(void){
	
	float area=0, r=3, r_quad; // r=2,3,5
	volatile float pi=0;
	
	r_quad=r*r;
	area = calculate_area(r);
	pi = my_division(&area,&r_quad);
  
	
 	while(1);
}

int calculate_area(int r){
	 
	int i,j,somma;
	
	 for(i=0;i<_ROWS;i++){
		 for(j=0;j<_COLUMNS;j+=2){
			 somma+=check_square(_Matrix_Coordinates[i][j],_Matrix_Coordinates[i][j+1],r);
		 }
	 }
	 
	 return somma;
}
