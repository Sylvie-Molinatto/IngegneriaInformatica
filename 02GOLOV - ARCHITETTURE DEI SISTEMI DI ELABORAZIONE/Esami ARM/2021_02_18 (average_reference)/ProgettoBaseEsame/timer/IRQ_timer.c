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

extern int led_accesi;
extern int result;
extern int num;
extern int riga;
extern int colonna;
extern unsigned int MAT[4][3];
extern int acquisition;

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
void TIMER0_IRQHandler (void)
{
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
  if(led_accesi==0){
		LED_Out(result);
		led_accesi=1;
	}
	else{
		LED_Off_All();
		led_accesi=0;
	}
	
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
	static int i,j;
	LED_Off_All();
	disable_timer(2);
	disable_timer(3);
	
  num=0;
	riga=0;
	colonna=0;
	
	for(i=0;i<=3;i++){
		for(j=0;j<=4;j++){
			MAT[i][j]=0;
		}
	}
	result=0;
	acquisition=1;
	reset_timer(0);
	reset_timer(1);
	enable_timer(0);
	enable_timer(1);
	
  LPC_TIM3->IR = 1;			/* clear interrupt flag */
  return;
}






/******************************************************************************
**                            End Of File
******************************************************************************/
