/*********************************************************************************************************
**--------------File Info---------------------------------------------------------------------------------
** File name:           IRQ_RIT.c
** Last modified Date:  2014-09-25
** Last Version:        V1.00
** Descriptions:        functions to manage T0 and T1 interrupts
** Correlated files:    RIT.h
**--------------------------------------------------------------------------------------------------------
*********************************************************************************************************/
#include "lpc17xx.h"
#include "RIT.h"
#include "../led/led.h"
#include "../timer/timer.h"


/******************************************************************************
** Function name:		RIT_IRQHandler
**
** Descriptions:		REPETITIVE INTERRUPT TIMER handler
**
** parameters:			None
** Returned value:		None
**
******************************************************************************/

#define N 4

extern int differenza_media_positivi_negativi(int V[], unsigned int num, char* over);

volatile int down_0 = 0;
volatile int down_1 = 0;
volatile int down_2 = 0;

volatile int stato = 0;
int VETT[N]={0};

volatile int val =0;
volatile unsigned int indice = 0;
char over=0;

extern char led_value;

void RIT_IRQHandler (void)
{	
	int i, res;	
	
	//static int select=0;
	static int J_down = 0;
	static int J_left = 0;
	static int J_right = 0;
	static int J_up = 0;
		
	
	if((LPC_GPIO1->FIOPIN & (1<<26)) == 0){	
		/* Joytick Select pressed p1.25*/
		/* Joytick Down pressed p1.26 --> using J_DOWN due to emulator issues*/
		
		J_down++;
		switch(J_down){
			case 1:
				if (stato==0){
					if (indice==N) {
						indice=0;
						if (led_value==3) {
						 stato=1;
						}
						else if (stato==0) {
						led_value++;
						LED_Out(led_value);
						}
					}
					disable_timer(2);
					val = LPC_TIM2->TC;
					enable_timer(2);
					VETT[indice] = val;
					indice++;
				}
				break;
			default:
				break;
		}
	}
	else{
			J_down=0;
	}
	
	if((LPC_GPIO1->FIOPIN & (1<<27)) == 0){	
		J_left++;
		switch(J_left){
			case 1:
				
				break;
			default:
				break;
		}
	}
	else{
			J_left=0;
	}
	
	if((LPC_GPIO1->FIOPIN & (1<<28)) == 0){	
		J_right++;
		switch(J_right){
			case 1:
				
				break;
			default:
				break;
		}
	}
	else{
			J_right=0;
	}
	
	
	
	if((LPC_GPIO1->FIOPIN & (1<<29)) == 0){	
		J_up++;
		switch(J_up){
			case 1:
				break;
			default:
				break;
		}
	}
	else{
			J_up=0;
	}
	
	if(down_0!=0){  
			down_0 ++;  
		if((LPC_GPIO2->FIOPIN & (1<<10)) == 0){

			switch(down_0){
			case 2:
				if (stato==2) {
					disable_timer(1);
					stato=0;
					LED_Out(0);
					indice=0;
					for(i=0; i<N; i++)
							VETT[i]=0;
				}		
				if (stato==1) {
					stato++;			
					LED_Out(0);
					res = differenza_media_positivi_negativi(VETT, N, &over);
					if (over == 0){
						if (res >= 0){
							LED_Out(255);
						}
						else {
							LED_On(7); //led 4 acceso fisso
						}
					}
					else {              //si è verificato overflow
						enable_timer(1);
					}
				}	
			
				
				break;
			default:
				break;
		}
	}
	else {	/* button released */
		down_0=0;			
		NVIC_EnableIRQ(EINT0_IRQn);							 /* enable Button interrupts			*/
		LPC_PINCON->PINSEL4    |= (1 << 20);     /* External interrupt 0 pin selection */
	}
	}	
	if(down_1!=0){  
			down_1 ++;  
		if((LPC_GPIO2->FIOPIN & (1<<11)) == 0){

			switch(down_1){
			case 2:
			
				break;
			default:
				break;
		}
	}
	else {	/* button released */
		down_1=0;			
		NVIC_EnableIRQ(EINT1_IRQn);							 /* enable Button interrupts			*/
		LPC_PINCON->PINSEL4    |= (1 << 22);     /* External interrupt 0 pin selection */
	}
	}
	if(down_2!=0){  
			down_2 ++;  
		if((LPC_GPIO2->FIOPIN & (1<<12)) == 0){
			switch(down_2){
			case 2:
				break;
			default:
			
				break;
		}
	}
	else {	/* button released */
		down_2=0;			
		NVIC_EnableIRQ(EINT2_IRQn); 							 /* enable Button interrupts			*/
		LPC_PINCON->PINSEL4    |= (1 << 24);     /* External interrupt 0 pin selection */
	}
	}
		
	reset_RIT();
  LPC_RIT->RICTRL |= 0x1;	/* clear interrupt flag */
	
  return;
}

/******************************************************************************
**                            End Of File
******************************************************************************/
