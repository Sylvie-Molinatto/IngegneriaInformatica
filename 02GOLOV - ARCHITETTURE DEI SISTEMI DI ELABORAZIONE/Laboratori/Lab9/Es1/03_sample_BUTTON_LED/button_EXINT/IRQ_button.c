#include "button.h"
#include "lpc17xx.h"
#include "string.h"
#include "../led/led.h"
#include "../GLCD/GLCD.h"

extern int translate_morse(char* vett_input, int vet_input_lenght, char* vett_output, int vet_output_lenght, char change_symbol, char space, char sentence_end);

void EINT0_IRQHandler (void)	  
{

	LPC_GPIO2->FIOCLR    = 0x000000FF;  //all LEDs off
  LPC_SC->EXTINT &= (1 << 0);     /* clear pending interrupt         */
}


void EINT1_IRQHandler (void)	  
{
  int i=0;
	int n=0;
	char input[100] = "00002111201002013112001210210021113011112001114";
	int length = strlen(input);
	for(i=0;i<length-1;i++){
		if((input[i+1]=='2'|| input[i+1]=='3' || input[i+1]=='4')){
			n++;
			LED_Out(n);
		}
		if(input[i]=='3'){
			n++;
			LED_Out(n);
		}
	}
	
	LPC_GPIO2->FIOSET    = 0x000000FF;	//all LEDs on 
	LPC_SC->EXTINT &= (1 << 1);     /* clear pending interrupt         */
	
}

void EINT2_IRQHandler (void)	  
{
	char input[100] = "00002111201002013112001210210021113011112001114";
	int length = strlen(input);
	const int dim = 100;
  char output[dim];
	volatile int RES;
	
	NVIC_DisableIRQ(EINT0_IRQn);
	LPC_PINCON->PINSEL4    |= (1 << 20);		 /* External interrupt 0 pin selection */
	NVIC_DisableIRQ(EINT1_IRQn);
	LPC_PINCON->PINSEL4    |= (1 << 22);     /* External interrupt 0 pin selection */
	
	RES = translate_morse(input,length,output,dim,'2','3','4');
	
	LED_Out(RES);
	
	
	GUI_Text(60, 280,(uint8_t*) output , Blue, White);
	
	NVIC_EnableIRQ(EINT0_IRQn);
  LPC_PINCON->PINSEL4    |= (1 << 20);		 /* External interrupt 0 pin selection */
	NVIC_EnableIRQ(EINT1_IRQn);
	LPC_PINCON->PINSEL4    |= (1 << 22);     /* External interrupt 0 pin selection */
 
  LPC_SC->EXTINT &= (1 << 2);     /* clear pending interrupt         */    
}


