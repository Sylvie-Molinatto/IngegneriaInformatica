/*********************************************************************************************************
**--------------File Info---------------------------------------------------------------------------------
** File name:           IRQ_timer.c
** Last modified Date:  2014-09-25
** Last Version:        V1.00
** Descriptions:        functions to manage T0 and T1 interrupts
** Correlated files:    timer.h
**--------------------------------------------------------------------------------------------------------
*********************************************************************************************************/
#include "lpc17xx.h"
#include "timer.h"
#include "../led/led.h"

/******************************************************************************
** Function name:		Timer0_IRQHandler
**
** Descriptions:		Timer/Counter 0 interrupt handler
**
** parameters:			None
** Returned value:		None
**
******************************************************************************/
extern unsigned char led_value;					/* defined in funct_led								*/
extern int led_accesi;
extern int result_num;
extern int result;
extern int posizione;
extern char VAR;
extern char VETT[];

void TIMER0_IRQHandler (void)
{
	
	if(led_accesi==0){
		LED_Out(0xff);
		led_accesi=1;
	}
	else{
		LED_Out(0x00);
		led_accesi=0;
	}
	
	LPC_TIM0->IR = 1;
	return;
}


/******************************************************************************
** Function name:		Timer1_IRQHandler
**
** Descriptions:		Timer/Counter 1 interrupt handler
**
** parameters:			None
** Returned value:		None
**
******************************************************************************/
void TIMER1_IRQHandler (void)
{
	int res;
	if(result_num==1){ 
    res = result<<16;		       
		LED_Out(res&0x000000ff);
		result_num++;
	}
	else if(result_num==2){
		res = result<<8;		
		LED_Out(res&0x000000ff);
		result_num++;
	}
	else if(result_num==3){
		LED_Out(result&0x000000ff);
		result_num++;
	}
	else{
		disable_timer(1);
		LED_Off_All();
		enable_timer(2);
		NVIC_EnableIRQ(EINT1_IRQn);
		LPC_PINCON->PINSEL4    &= ~(1 << 22);     /* GPIO pin selection */
	}
  LPC_TIM1->IR = 1;			/* clear interrupt flag */
  return;
}

/******************************************************************************
** Function name:		Timer2_IRQHandler
**
** Descriptions:		Timer/Counter 2 interrupt handler
**
** parameters:			None
** Returned value:		None
**
******************************************************************************/
void TIMER2_IRQHandler (void)
{
	static int i;
	VAR=0;
	for(i=0;i<posizione;i++){
		VETT[i]=0;
	}
	posizione=0;
  LPC_TIM2->IR = 1;			/* clear interrupt flag */
  return;
}

/******************************************************************************
** Function name:		Timer3_IRQHandler
**
** Descriptions:		Timer/Counter 3 interrupt handler
**
** parameters:			None
** Returned value:		None
**
******************************************************************************/
void TIMER3_IRQHandler (void)
{
  LPC_TIM3->IR = 1;			/* clear interrupt flag */
  return;
}






/******************************************************************************
**                            End Of File
******************************************************************************/
